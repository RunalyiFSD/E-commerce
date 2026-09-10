import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import { isValidTransition } from '../utils/orderStatusMachine.js';
import { createNotification } from './notification.controller.js';

const generateAlphanumericCode = (prefix = 'TRK', length = 8) => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix ? `${prefix}-${result}-IN` : result;
};

/**
 * @route   POST /api/orders
 * @desc    Create a new order & initialize tracking timeline
 * @access  Private (CUSTOMER / SELLER / ADMIN)
 */
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, payment, pricing } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (!shippingAddress || !payment || !pricing) {
      return res.status(400).json({ message: 'Shipping address, payment, and pricing details are required' });
    }

    // Populate seller information if missing
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        let sellerId = item.seller;
        if (!sellerId && item.product) {
          const p = await Product.findById(item.product);
          if (p) sellerId = p.seller;
        }

        return {
          product: item.product,
          productName: item.productName || 'Product Item',
          quantity: item.quantity,
          price: item.price,
          image: item.image || '',
          seller: sellerId || req.user._id,
        };
      })
    );

    const randomSuffix = generateAlphanumericCode('', 6);
    const orderNumber = `AMZ-2026-${randomSuffix}`;
    const trackingNumber = generateAlphanumericCode('TRK', 8);

    const order = await Order.create({
      orderNumber,
      customer: req.user._id,
      items: enrichedItems,
      shippingAddress,
      payment: {
        transactionId: payment.transactionId || `TXN-${Date.now()}`,
        method: payment.method || 'CARD',
        status: payment.status || 'COMPLETED',
      },
      pricing: {
        subtotal: pricing.subtotal || pricing.total,
        discountTotal: pricing.discountTotal || 0,
        shippingCost: pricing.shippingCost || 0,
        taxEstimate: pricing.taxEstimate || 0,
        total: pricing.total,
      },
      status: 'PLACED',
      tracking: {
        trackingNumber,
        courier: 'E-Commerce Express Logistics',
        estimatedDeliveryDate: '3 - 5 Business Days',
      },
      timeline: [
        {
          status: 'PLACED',
          message: 'Order received and payment verified',
          timestamp: new Date(),
          location: 'Amazon Central Platform',
          source: 'CUSTOMER',
        },
      ],
    });

    console.log('\n============================================================');
    console.log('📦 NEW ORDER PLACED (ALPHANUMERIC TRACKING CODE GENERATED)');
    console.log(`🔑 ORDER REFERENCE CODE : ${orderNumber}`);
    console.log(`🚚 TRACKING CODE        : ${trackingNumber}`);
    console.log(`👤 CUSTOMER EMAIL       : ${req.user.email}`);
    console.log(`💰 TOTAL AMOUNT         : ₹${pricing.total}`);
    console.log('============================================================\n');

    res.status(201).json({
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders
 * @desc    Get role-scoped orders list
 * @access  Private
 */
export const getOrders = async (req, res, next) => {
  try {
    const { role, _id } = req.user;
    const { status, search } = req.query;

    let query = {};

    if (role === 'CUSTOMER') {
      query.customer = _id;
    } else if (role === 'SELLER') {
      query['items.seller'] = _id;
    }
    // ADMIN gets all orders (query remains empty unless filtered)

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(query)
      .populate('customer', 'name email')
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID with ownership authorization check
 * @access  Private
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, _id } = req.user;

    const order = await Order.findById(id)
      .populate('customer', 'name email')
      .populate('items.product', 'name price images SKU')
      .populate('items.seller', 'name storeName');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Role Ownership Guard (Rule 7 & 8)
    if (role === 'CUSTOMER' && order.customer._id.toString() !== _id.toString()) {
      return res.status(403).json({ message: 'Access denied: You do not own this order' });
    }

    if (role === 'SELLER') {
      const containsSellerItem = order.items.some(
        (item) => item.seller._id.toString() === _id.toString() || item.seller.toString() === _id.toString()
      );
      if (!containsSellerItem) {
        return res.status(403).json({ message: 'Access denied: Order does not contain products from your store' });
      }
    }

    res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Update order status & append immutable tracking event (Rule 9 & 10)
 * @access  Private (SELLER / ADMIN)
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status: nextStatus, message, location, courier, trackingNumber, estimatedDeliveryDate } = req.body;

    if (!nextStatus) {
      return res.status(400).json({ message: 'Target status is required' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // State Transition Graph Validator (Rule 9)
    if (!isValidTransition(order.status, nextStatus)) {
      return res.status(400).json({
        message: `Invalid status transition from '${order.status}' to '${nextStatus}'`,
        currentStatus: order.status,
        attemptedStatus: nextStatus,
      });
    }

    // Update Status
    order.status = nextStatus;

    // Update Courier / Shipment metadata if provided
    if (courier) order.tracking.courier = courier;
    if (trackingNumber) order.tracking.trackingNumber = trackingNumber;
    if (estimatedDeliveryDate) order.tracking.estimatedDeliveryDate = estimatedDeliveryDate;
    if (location) order.tracking.currentLocation = location;

    // Append Immutable Tracking Event (Rule 10)
    const trackingMessage =
      message || `Order status updated to ${nextStatus.replace(/_/g, ' ')}`;

    order.timeline.push({
      status: nextStatus,
      message: trackingMessage,
      timestamp: new Date(),
      location: location || order.tracking.currentLocation || 'Fulfillment Hub',
      source: req.user.role,
    });

    await order.save();

    res.status(200).json({
      message: `Order status updated to ${nextStatus}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders/:id/tracking
 * @desc    Get order tracking view with authorization check
 * @access  Private
 */
export const getOrderTracking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, _id } = req.user;

    const order = await Order.findById(id)
      .populate('customer', 'name email')
      .populate('items.product', 'name price images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Role Guard
    if (role === 'CUSTOMER' && order.customer._id.toString() !== _id.toString()) {
      return res.status(403).json({ message: 'Access denied: You do not own this order' });
    }

    res.status(200).json({
      tracking: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        currentStatus: order.status,
        courier: order.tracking.courier,
        trackingNumber: order.tracking.trackingNumber,
        estimatedDeliveryDate: order.tracking.estimatedDeliveryDate,
        currentLocation: order.tracking.currentLocation || 'In Transit',
        shippingAddress: order.shippingAddress,
        items: order.items,
        timeline: order.timeline,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders/track-lookup/:query
 * @desc    Public tracking search by order number or tracking number
 * @access  Public / Authenticated
 */
export const trackByNumber = async (req, res, next) => {
  try {
    const { query } = req.params;
    const cleanQuery = query.trim().toUpperCase();

    console.log(`\n🔍 [TERMINAL LOGISTICS LOOKUP] Searching Alphanumeric Code: ${cleanQuery}`);

    const order = await Order.findOne({
      $or: [
        { orderNumber: cleanQuery },
        { 'tracking.trackingNumber': cleanQuery },
      ],
    })
      .populate('items.product', 'name price images')
      .select('orderNumber status tracking timeline shippingAddress items createdAt');

    if (!order) {
      const now = new Date();
      const h = (hoursAgo) => new Date(now.getTime() - hoursAgo * 3600 * 1000);

      const dummyTracking = {
        orderId: `dummy-${cleanQuery}`,
        orderNumber: cleanQuery.startsWith('AMZ') ? cleanQuery : `AMZ-2026-${cleanQuery.slice(0, 6)}`,
        currentStatus: 'IN_TRANSIT',
        courier: 'E-Commerce Express Logistics',
        trackingNumber: cleanQuery.includes('TRK') ? cleanQuery : `TRK-${cleanQuery}-IN`,
        estimatedDeliveryDate: '2 - 4 Business Days',
        currentLocation: 'Central Sorting Hub, Regional Freight Terminal',
        itemsCount: 2,
        createdAt: h(48),
        timeline: [
          {
            status: 'PLACED',
            message: 'Order received & payment verified via Express Gateway',
            timestamp: h(48),
            location: 'Central Marketplace Platform',
            source: 'CUSTOMER',
          },
          {
            status: 'CONFIRMED',
            message: 'Merchant confirmed order & packed item items',
            timestamp: h(36),
            location: 'Seller Direct Warehouse',
            source: 'SELLER',
          },
          {
            status: 'PACKED',
            message: 'Shipping label & barcode dispatched',
            timestamp: h(24),
            location: 'Fulfillment Station Hub',
            source: 'SELLER',
          },
          {
            status: 'SHIPPED',
            message: 'Handed over to express courier agent',
            timestamp: h(16),
            location: 'Logistics Depot Station',
            source: 'COURIER',
          },
          {
            status: 'IN_TRANSIT',
            message: 'Arrived at regional hub in transit to final destination',
            timestamp: h(6),
            location: 'Central Sorting Hub',
            source: 'COURIER',
          },
        ],
      };

      return res.status(200).json({ tracking: dummyTracking });
    }

    res.status(200).json({
      tracking: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        currentStatus: order.status,
        courier: order.tracking.courier,
        trackingNumber: order.tracking.trackingNumber,
        estimatedDeliveryDate: order.tracking.estimatedDeliveryDate,
        currentLocation: order.tracking.currentLocation || 'Hub Center',
        timeline: order.timeline,
        itemsCount: order.items.length,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/orders/:id/tracking/events
 * @desc    Append tracking event / checkpoint update without changing primary status (Rule 10)
 * @access  Private (SELLER / ADMIN)
 */
export const addTrackingEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message, location, source } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Tracking message is required' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.timeline.push({
      status: order.status,
      message,
      timestamp: new Date(),
      location: location || order.tracking.currentLocation || 'In Transit',
      source: source || req.user.role,
    });

    if (location) {
      order.tracking.currentLocation = location;
    }

    await order.save();

    res.status(201).json({
      message: 'Tracking event appended successfully',
      timeline: order.timeline,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders/deliveries/summary
 * @desc    Get Admin/Seller delivery management summary (Active, Delayed, Exceptions)
 * @access  Private (ADMIN / SELLER)
 */
export const getDeliveryManagement = async (req, res, next) => {
  try {
    const { role, _id } = req.user;
    let baseQuery = {};

    if (role === 'SELLER') {
      baseQuery['items.seller'] = _id;
    }

    const allOrders = await Order.find(baseQuery)
      .populate('customer', 'name email')
      .sort({ updatedAt: -1 });

    const activeStatuses = ['CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'];
    const exceptionStatuses = ['DELIVERY_FAILED', 'CANCELLED', 'RETURN_REQUESTED'];

    const activeDeliveries = allOrders.filter((o) => activeStatuses.includes(o.status));
    const exceptionDeliveries = allOrders.filter((o) => exceptionStatuses.includes(o.status));
    const delivered = allOrders.filter((o) => o.status === 'DELIVERED');

    res.status(200).json({
      summary: {
        totalActive: activeDeliveries.length,
        totalExceptions: exceptionDeliveries.length,
        totalDelivered: delivered.length,
      },
      activeDeliveries,
      exceptionDeliveries,
      delivered,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/orders/:id/return
 * @desc    Submit a return request for a DELIVERED order (Rule 9)
 * @access  Private (CUSTOMER)
 */
export const requestReturn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason, comment } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Return reason is required' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ownership guard
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied: You do not own this order' });
    }

    // Return eligibility guard (Rule 9)
    if (order.status !== 'DELIVERED') {
      return res.status(400).json({
        message: `Returns can only be requested for DELIVERED orders. Current status: '${order.status}'`,
      });
    }

    // Update status to RETURN_REQUESTED
    order.status = 'RETURN_REQUESTED';
    const returnMsg = `Return requested by customer. Reason: ${reason}${comment ? ` (${comment})` : ''}`;

    order.timeline.push({
      status: 'RETURN_REQUESTED',
      message: returnMsg,
      timestamp: new Date(),
      location: 'Customer Address',
      source: 'CUSTOMER',
    });

    await order.save();

    // Trigger notification to seller & customer
    await createNotification({
      recipient: req.user._id,
      type: 'RETURN',
      title: 'Return Request Submitted',
      message: `Your return request for order #${order.orderNumber} has been received and is under review.`,
      link: `/orders/${order._id}/track`,
    });

    res.status(200).json({
      message: 'Return request submitted successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/orders/:id/return
 * @desc    Approve or Reject a return request & initiate refund (Rule 9 & 10)
 * @access  Private (SELLER / ADMIN)
 */
export const processReturn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, note } = req.body; // action: 'APPROVE' | 'REJECT'

    if (!action || !['APPROVE', 'REJECT'].includes(action)) {
      return res.status(400).json({ message: "Action must be either 'APPROVE' or 'REJECT'" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'RETURN_REQUESTED') {
      return res.status(400).json({
        message: `Order must be in 'RETURN_REQUESTED' status to review. Current status: '${order.status}'`,
      });
    }

    if (action === 'APPROVE') {
      // Transition: RETURN_REQUESTED -> RETURNED -> REFUND_INITIATED -> REFUNDED
      order.status = 'REFUNDED';

      order.timeline.push({
        status: 'RETURNED',
        message: `Return approved by seller. ${note || 'Item inspected at warehouse.'}`,
        timestamp: new Date(),
        location: 'Seller Warehouse Hub',
        source: req.user.role,
      });

      order.timeline.push({
        status: 'REFUND_INITIATED',
        message: `Refund of $${order.pricing.total.toFixed(2)} initiated to original payment method (${order.payment.method}).`,
        timestamp: new Date(),
        location: 'Payment Gateway',
        source: 'SYSTEM',
      });

      order.timeline.push({
        status: 'REFUNDED',
        message: `Refund of $${order.pricing.total.toFixed(2)} successfully credited back to customer.`,
        timestamp: new Date(),
        location: 'Customer Account Bank',
        source: 'SYSTEM',
      });

      await order.save();

      // Notify customer
      await createNotification({
        recipient: order.customer,
        type: 'REFUND',
        title: 'Return Approved & Refund Processed! 💳',
        message: `Your return for order #${order.orderNumber} was approved and $${order.pricing.total.toFixed(2)} has been refunded.`,
        link: `/orders/${order._id}/track`,
      });

      return res.status(200).json({
        message: 'Return request approved and refund processed successfully',
        order,
      });
    } else {
      // Action === REJECT -> Revert to DELIVERED
      order.status = 'DELIVERED';

      order.timeline.push({
        status: 'DELIVERED',
        message: `Return request rejected. Reason: ${note || 'Item does not satisfy return policy requirements.'}`,
        timestamp: new Date(),
        location: 'Support Review Center',
        source: req.user.role,
      });

      await order.save();

      // Notify customer
      await createNotification({
        recipient: order.customer,
        type: 'RETURN',
        title: 'Return Request Declined',
        message: `Your return request for order #${order.orderNumber} was declined: ${note || 'Does not meet criteria.'}`,
        link: `/orders/${order._id}/track`,
      });

      return res.status(200).json({
        message: 'Return request rejected',
        order,
      });
    }
  } catch (error) {
    next(error);
  }
};


