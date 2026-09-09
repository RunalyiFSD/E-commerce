import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../server/models/user.model.js';
import Product from '../server/models/product.model.js';
import Category from '../server/models/category.model.js';
import Order from '../server/models/order.model.js';
import { isValidTransition } from '../server/utils/orderStatusMachine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_db';

async function runPhase9TrackingTests() {
  console.log('--- STARTING PHASE 9 ORDER TRACKING & DELIVERY EMPIRICAL TESTS ---');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Setup Mock Users
    const customer = await User.findOneAndUpdate(
      { email: 'track_customer@example.com' },
      { name: 'Track Customer', email: 'track_customer@example.com', password: 'password123', role: 'CUSTOMER' },
      { upsert: true, new: true }
    );

    const seller = await User.findOneAndUpdate(
      { email: 'track_seller@example.com' },
      { name: 'Track Seller', storeName: 'Tech Express Store', email: 'track_seller@example.com', password: 'password123', role: 'SELLER' },
      { upsert: true, new: true }
    );

    const admin = await User.findOneAndUpdate(
      { email: 'track_admin@example.com' },
      { name: 'Track Admin', email: 'track_admin@example.com', password: 'password123', role: 'ADMIN' },
      { upsert: true, new: true }
    );

    console.log('✅ Mock users initialized');

    // 2. Setup Category & Product
    const category = await Category.findOneAndUpdate(
      { slug: 'logistics-tech' },
      { name: 'Logistics Tech', slug: 'logistics-tech', createdBy: admin._id },
      { upsert: true, new: true }
    );

    const product = await Product.findOneAndUpdate(
      { SKU: 'TRK-SKU-999' },
      {
        name: 'GPS Tracker Device',
        slug: 'gps-tracker-device',
        description: 'Real-time vehicle and package tracker',
        price: 89.99,
        category: category._id,
        seller: seller._id,
        stock: 50,
        SKU: 'TRK-SKU-999',
      },
      { upsert: true, new: true }
    );

    console.log('✅ Mock product initialized');

    // 3. Create Order
    const orderNumber = `AMZ-2026-TRK${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `TRK-${Math.floor(100000 + Math.random() * 900000)}-US`;

    const order = await Order.create({
      orderNumber,
      customer: customer._id,
      items: [
        {
          product: product._id,
          productName: product.name,
          quantity: 2,
          price: product.price,
          seller: seller._id,
        },
      ],
      shippingAddress: {
        fullName: 'Jane Doe',
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        zipCode: '97477',
        phone: '555-0199',
      },
      payment: {
        transactionId: `TXN-TRK-${Date.now()}`,
        method: 'CREDIT_CARD',
        status: 'COMPLETED',
      },
      pricing: {
        subtotal: 179.98,
        discountTotal: 0,
        shippingCost: 9.99,
        taxEstimate: 14.40,
        total: 204.37,
      },
      status: 'PLACED',
      tracking: {
        trackingNumber,
        courier: 'Amazon Logistics',
        estimatedDeliveryDate: '3 - 5 Business Days',
        currentLocation: 'Amazon Fulfillment Center',
      },
      timeline: [
        {
          status: 'PLACED',
          message: 'Order received and payment authorized',
          timestamp: new Date(),
          location: 'Amazon Central System',
          source: 'CUSTOMER',
        },
      ],
    });

    console.log(`✅ Order ${order.orderNumber} created with initial tracking event`);

    // 4. Test Lifecycle Transitions (Rule 9 & Rule 10)
    const transitions = [
      { next: 'CONFIRMED', loc: 'Seattle Hub', msg: 'Order confirmed by seller' },
      { next: 'PROCESSING', loc: 'Warehouse Bay 3', msg: 'Package picked and packed' },
      { next: 'PACKED', loc: 'Warehouse Shipping Dock', msg: 'Shipping label created' },
      { next: 'SHIPPED', loc: 'Amazon Regional Sorting Hub', msg: 'Handed over to carrier truck' },
      { next: 'IN_TRANSIT', loc: 'Chicago Sorting Center, IL', msg: 'Package in transit between hubs' },
      { next: 'OUT_FOR_DELIVERY', loc: 'Springfield Local Dispatch', msg: 'Out for delivery with driver' },
      { next: 'DELIVERED', loc: 'Customer Front Porch', msg: 'Delivered and signed by recipient' },
    ];

    for (const step of transitions) {
      if (!isValidTransition(order.status, step.next)) {
        throw new Error(`State machine error: Transition from ${order.status} to ${step.next} rejected!`);
      }

      order.status = step.next;
      order.tracking.currentLocation = step.loc;
      order.timeline.push({
        status: step.next,
        message: step.msg,
        timestamp: new Date(),
        location: step.loc,
        source: 'COURIER',
      });
      await order.save();
      console.log(`  -> Advanced status to ${step.next} (${step.loc})`);
    }

    console.log(`✅ Full lifecycle status transitions verified (${order.timeline.length} timeline nodes)`);

    // 5. Test Illegal Status Transition Rejection (Rule 9)
    const illegalJump = isValidTransition(order.status, 'PLACED');
    if (illegalJump) {
      throw new Error(`Rule 9 Violation: Illegal jump from ${order.status} to PLACED was accepted!`);
    }
    console.log('✅ Rule 9 Guard: Illegal jump from DELIVERED -> PLACED correctly blocked');

    // 6. Test Appending Custom Tracking Checkpoint (Rule 10)
    order.timeline.push({
      status: order.status,
      message: 'Post-delivery satisfaction confirmation check',
      timestamp: new Date(),
      location: 'Customer Front Porch',
      source: 'SYSTEM',
    });
    await order.save();
    console.log(`✅ Rule 10 Guard: Appended custom checkpoint node. Total nodes: ${order.timeline.length}`);

    // 7. Verify Lookup Query by Order Number & Tracking Number
    const foundByOrderNum = await Order.findOne({ orderNumber });
    if (!foundByOrderNum) throw new Error('Failed to query order by orderNumber');

    const foundByTrackingNum = await Order.findOne({ 'tracking.trackingNumber': trackingNumber });
    if (!foundByTrackingNum) throw new Error('Failed to query order by trackingNumber');

    console.log('✅ Public/Customer Tracking lookup queries verified');

    // Clean up test order
    await Order.findByIdAndDelete(order._id);
    console.log('🧹 Cleaned up test order');

    console.log('--- ALL PHASE 9 TRACKING & DELIVERY TESTS PASSED 100% ---');
  } catch (error) {
    console.error('❌ Phase 9 Test Failure:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

runPhase9TrackingTests();
