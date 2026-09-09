import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from './models/user.model.js';
import Product from './models/product.model.js';
import Category from './models/category.model.js';
import Order from './models/order.model.js';
import Notification from './models/notification.model.js';
import { isValidTransition } from './utils/orderStatusMachine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_db';

async function runPhase11Tests() {
  console.log('--- STARTING PHASE 11 NOTIFICATIONS & RETURNS EMPIRICAL TESTS ---');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Setup Mock Users
    const customer = await User.findOneAndUpdate(
      { email: 'ret_customer@example.com' },
      { name: 'Return Customer', email: 'ret_customer@example.com', password: 'password123', role: 'CUSTOMER' },
      { upsert: true, new: true }
    );

    const seller = await User.findOneAndUpdate(
      { email: 'ret_seller@example.com' },
      { name: 'Return Seller', storeName: 'Return Store', email: 'ret_seller@example.com', password: 'password123', role: 'SELLER' },
      { upsert: true, new: true }
    );

    const admin = await User.findOneAndUpdate(
      { email: 'ret_admin@example.com' },
      { name: 'Return Admin', email: 'ret_admin@example.com', password: 'password123', role: 'ADMIN' },
      { upsert: true, new: true }
    );

    console.log('✅ Mock users initialized');

    // 2. Setup Category & Product
    const category = await Category.findOneAndUpdate(
      { slug: 'returnable-goods' },
      { name: 'Returnable Goods', slug: 'returnable-goods', createdBy: admin._id },
      { upsert: true, new: true }
    );

    const product = await Product.findOneAndUpdate(
      { SKU: 'RET-SKU-100' },
      {
        name: 'Wireless Earbuds',
        slug: 'wireless-earbuds',
        description: 'Noise cancelling earbuds',
        price: 99.99,
        category: category._id,
        seller: seller._id,
        inventory: 20,
        SKU: 'RET-SKU-100',
      },
      { upsert: true, new: true }
    );

    // 3. Create DELIVERED Order
    const orderNum = `AMZ-2026-RET${Math.floor(1000 + Math.random() * 9000)}`;
    const deliveredOrder = await Order.create({
      orderNumber: orderNum,
      customer: customer._id,
      items: [
        {
          product: product._id,
          productName: product.name,
          quantity: 1,
          price: product.price,
          seller: seller._id,
        },
      ],
      shippingAddress: {
        fullName: 'Return Customer',
        street: '123 Main St',
        city: 'Portland',
        state: 'OR',
        zipCode: '97201',
        phone: '555-0155',
      },
      payment: {
        transactionId: `TXN-RET-${Date.now()}`,
        method: 'CREDIT_CARD',
        status: 'COMPLETED',
      },
      pricing: {
        subtotal: 99.99,
        discountTotal: 0,
        shippingCost: 0,
        taxEstimate: 8.00,
        total: 107.99,
      },
      status: 'DELIVERED',
      tracking: {
        trackingNumber: 'TRK-RET-789',
        courier: 'FedEx Express',
        estimatedDeliveryDate: 'Delivered Today',
        currentLocation: 'Customer Doorstep',
      },
      timeline: [
        { status: 'PLACED', message: 'Order received', timestamp: new Date(), source: 'CUSTOMER' },
        { status: 'DELIVERED', message: 'Package delivered', timestamp: new Date(), source: 'COURIER' },
      ],
    });

    console.log(`✅ Delivered Order ${deliveredOrder.orderNumber} created`);

    // 4. Test Customer Return Request Submission (Rule 9)
    if (!isValidTransition(deliveredOrder.status, 'RETURN_REQUESTED')) {
      throw new Error('State machine error: DELIVERED -> RETURN_REQUESTED should be valid!');
    }

    deliveredOrder.status = 'RETURN_REQUESTED';
    deliveredOrder.timeline.push({
      status: 'RETURN_REQUESTED',
      message: 'Return requested by customer. Reason: Size or fit issue',
      timestamp: new Date(),
      location: 'Customer Address',
      source: 'CUSTOMER',
    });
    await deliveredOrder.save();

    console.log('✅ Rule 9 Guard: Transition DELIVERED -> RETURN_REQUESTED accepted');

    // Create Notification
    const notif = await Notification.create({
      recipient: customer._id,
      type: 'RETURN',
      title: 'Return Request Received',
      message: `Your return request for order #${deliveredOrder.orderNumber} is under review.`,
      link: `/orders/${deliveredOrder._id}/track`,
    });
    console.log('✅ In-app notification created');

    // 5. Test Merchant Return Approval & Refund Lifecycle (Rule 9 & Rule 10)
    // RETURN_REQUESTED -> RETURNED -> REFUND_INITIATED -> REFUNDED
    const steps = ['RETURNED', 'REFUND_INITIATED', 'REFUNDED'];
    for (const st of steps) {
      deliveredOrder.status = st;
      deliveredOrder.timeline.push({
        status: st,
        message: `Status updated to ${st}`,
        timestamp: new Date(),
        location: 'Merchant Operations',
        source: 'SELLER',
      });
    }
    await deliveredOrder.save();

    console.log(`✅ Refund lifecycle completed. Final status: ${deliveredOrder.status}, Timeline nodes: ${deliveredOrder.timeline.length}`);

    // Create Refund Notification
    await Notification.create({
      recipient: customer._id,
      type: 'REFUND',
      title: 'Refund Credit Processed',
      message: `Refund of $107.99 credited back to credit card.`,
      link: `/orders/${deliveredOrder._id}/track`,
    });

    // 6. Verify Notifications Query & Mark as Read
    const unreadCount = await Notification.countDocuments({ recipient: customer._id, isRead: false });
    if (unreadCount < 2) {
      throw new Error(`Expected at least 2 unread notifications, got ${unreadCount}`);
    }
    console.log(`✅ Notifications Query Verified (Unread count: ${unreadCount})`);

    await Notification.updateMany({ recipient: customer._id }, { isRead: true });
    const postReadUnread = await Notification.countDocuments({ recipient: customer._id, isRead: false });
    if (postReadUnread !== 0) {
      throw new Error('Failed to mark all notifications as read!');
    }
    console.log('✅ Mark All Read Verified (Unread count: 0)');

    // Clean up test order & notifications
    await Order.findByIdAndDelete(deliveredOrder._id);
    await Notification.deleteMany({ recipient: customer._id });
    console.log('🧹 Cleaned up test return order & notifications');

    console.log('--- ALL PHASE 11 NOTIFICATIONS & RETURNS TESTS PASSED 100% ---');
  } catch (error) {
    console.error('❌ Phase 11 Test Failure:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

runPhase11Tests();
