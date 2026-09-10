import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import Category from '../models/category.model.js';
import User from '../models/user.model.js';

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get role-scoped dashboard analytics & metrics
 * @access  Private
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const { role, _id } = req.user;

    if (role === 'CUSTOMER') {
      const totalOrders = await Order.countDocuments({ customer: _id });
      const activeStatuses = ['CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'];
      const activeShipmentsCount = await Order.countDocuments({
        customer: _id,
        status: { $in: activeStatuses },
      });

      const recentOrders = await Order.find({ customer: _id })
        .populate('items.product', 'name price images')
        .sort({ createdAt: -1 })
        .limit(5);

      const activeShipment = await Order.findOne({
        customer: _id,
        status: { $in: activeStatuses },
      })
        .populate('items.product', 'name price images')
        .sort({ updatedAt: -1 });

      return res.status(200).json({
        role: 'CUSTOMER',
        stats: {
          totalOrders,
          activeShipmentsCount,
          deliveredCount: await Order.countDocuments({ customer: _id, status: 'DELIVERED' }),
        },
        activeShipment,
        recentOrders,
      });
    }

    if (role === 'SELLER') {
      const totalStoreOrders = await Order.countDocuments({ 'items.seller': _id });
      const pendingFulfillmentCount = await Order.countDocuments({
        'items.seller': _id,
        status: { $in: ['PLACED', 'CONFIRMED', 'PROCESSING', 'PACKED'] },
      });

      const totalStoreProducts = await Product.countDocuments({ seller: _id });
      const lowStockQuery = { seller: _id, $or: [{ inventory: { $lte: 5 } }, { stock: { $lte: 5 } }] };
      const lowStockProducts = await Product.find(lowStockQuery).limit(5);
      const lowStockCount = await Product.countDocuments(lowStockQuery);

      // Compute total store revenue for this seller
      const sellerOrders = await Order.find({ 'items.seller': _id, status: { $ne: 'CANCELLED' } });
      let totalRevenue = 0;
      sellerOrders.forEach((ord) => {
        (ord.items || []).forEach((item) => {
          if (item.seller && String(item.seller) === String(_id)) {
            totalRevenue += (item.price || 0) * (item.quantity || 1);
          }
        });
      });

      const recentStoreOrders = await Order.find({ 'items.seller': _id })
        .populate('customer', 'name email')
        .sort({ createdAt: -1 })
        .limit(5);

      return res.status(200).json({
        role: 'SELLER',
        stats: {
          totalStoreOrders,
          pendingFulfillmentCount,
          totalStoreProducts,
          lowStockCount,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
        },
        lowStockProducts,
        recentOrders: recentStoreOrders,
      });
    }

    if (role === 'ADMIN') {
      const totalCustomers = await User.countDocuments({ role: 'CUSTOMER' });
      const totalSellers = await User.countDocuments({ role: 'SELLER' });
      const totalProducts = await Product.countDocuments();
      const totalCategories = await Category.countDocuments();
      const totalOrders = await Order.countDocuments();

      const activeStatuses = ['CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'];
      const exceptionStatuses = ['DELIVERY_FAILED', 'CANCELLED', 'RETURN_REQUESTED'];

      const totalActiveDeliveries = await Order.countDocuments({ status: { $in: activeStatuses } });
      const totalExceptions = await Order.countDocuments({ status: { $in: exceptionStatuses } });
      const totalDelivered = await Order.countDocuments({ status: 'DELIVERED' });

      // Calculate total platform GMV
      const allOrders = await Order.find({ status: { $ne: 'CANCELLED' } });
      const totalGMV = allOrders.reduce((sum, ord) => sum + (ord.pricing?.total || 0), 0);

      const recentOrders = await Order.find()
        .populate('customer', 'name email')
        .sort({ createdAt: -1 })
        .limit(5);

      return res.status(200).json({
        role: 'ADMIN',
        stats: {
          totalGMV: Math.round(totalGMV * 100) / 100,
          totalCustomers,
          totalSellers,
          totalProducts,
          totalCategories,
          totalOrders,
          totalActiveDeliveries,
          totalExceptions,
          totalDelivered,
        },
        recentOrders,
      });
    }

    res.status(400).json({ message: 'Invalid role' });
  } catch (error) {
    next(error);
  }
};
