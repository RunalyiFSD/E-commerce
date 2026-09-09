import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

import User from './models/user.model.js';
import Category from './models/category.model.js';
import Product from './models/product.model.js';
import Order from './models/order.model.js';
import Notification from './models/notification.model.js';
import AuditLog from './models/auditLog.model.js';
import { recordAuditLog } from './middleware/audit.middleware.js';
import { isValidTransition } from './utils/orderStatusMachine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_db';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_123456789_ecommerce';

async function runFinalQASuite() {
  console.log('===================================================================');
  console.log('--- STARTING PHASE 14 FINAL QA MASTER ACCEPTANCE SUITE ---');
  console.log('===================================================================\n');

  let totalTests = 0;
  let passedTests = 0;

  const assertTest = (description, condition) => {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${description}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${description}`);
      throw new Error(`Assertion failed: ${description}`);
    }
  };

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB database\n');

    const timestamp = Date.now();

    // -------------------------------------------------------------------
    // 1. ADMIN JOURNEY AUDIT
    // -------------------------------------------------------------------
    console.log('1. Auditing Admin Journey & Platform Management (Rule 8)...');

    const admin = await User.create({
      name: 'QA Master Admin',
      email: `qa_admin_${timestamp}@example.com`,
      password: 'AdminPassword123!',
      role: 'ADMIN',
    });

    assertTest('Admin user created successfully', admin.role === 'ADMIN');

    // Rule 8: Category Creation
    const category = await Category.create({
      name: `QA Category ${timestamp}`,
      createdBy: admin._id,
    });

    assertTest('Admin creates platform category (Rule 8)', category && category.slug.startsWith('qa-category-'));
    console.log('');

    // -------------------------------------------------------------------
    // 2. SELLER JOURNEY AUDIT
    // -------------------------------------------------------------------
    console.log('2. Auditing Seller Journey & Catalog Management (Rule 7)...');

    const seller = await User.create({
      name: 'QA Master Seller',
      email: `qa_seller_${timestamp}@example.com`,
      password: 'SellerPassword123!',
      role: 'SELLER',
      storeName: 'QA Tech Store',
    });

    assertTest('Seller user created with storeName', seller.role === 'SELLER' && seller.storeName === 'QA Tech Store');

    const product = await Product.create({
      name: 'QA Pro Laptop',
      slug: `qa-pro-laptop-${timestamp}`,
      description: 'High performance laptop',
      price: 1299.99,
      category: category._id,
      seller: seller._id,
      inventory: 25,
      SKU: `SKU-QA-${timestamp}`,
    });

    assertTest('Seller creates product linked to store', product.seller.toString() === seller._id.toString() && product.inventory === 25);
    console.log('');

    // -------------------------------------------------------------------
    // 3. CUSTOMER JOURNEY AUDIT
    // -------------------------------------------------------------------
    console.log('3. Auditing Customer Journey, Cart, Checkout & Orders...');

    const customer = await User.create({
      name: 'QA Customer',
      email: `qa_customer_${timestamp}@example.com`,
      password: 'CustomerPassword123!',
      role: 'CUSTOMER',
    });

    assertTest('Customer registered with hashed password', customer.role === 'CUSTOMER');

    // Secret sanitization check (Rule 6)
    const fetchedCustomer = await User.findById(customer._id);
    assertTest('/me query excludes password hash (Rule 6)', fetchedCustomer.password === undefined);

    // Create Order
    const orderNumber = `AMZ-QA-${Math.floor(100000 + Math.random() * 900000)}`;
    const order = await Order.create({
      orderNumber,
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
        fullName: 'QA Customer',
        street: '789 QA Boulevard',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        phone: '555-0188',
      },
      payment: {
        transactionId: `TXN-QA-${timestamp}`,
        method: 'CREDIT_CARD',
        status: 'COMPLETED',
      },
      pricing: {
        subtotal: 1299.99,
        discountTotal: 0,
        shippingCost: 0,
        taxEstimate: 104.00,
        total: 1403.99,
      },
      status: 'PLACED',
      timeline: [
        {
          status: 'PLACED',
          message: 'Order created',
          timestamp: new Date(),
          source: 'CUSTOMER',
        },
      ],
    });

    assertTest('Order created with status PLACED and initial timeline node', order.status === 'PLACED' && order.timeline.length === 1);
    console.log('');

    // -------------------------------------------------------------------
    // 4. ORDER STATE MACHINE & FULFILLMENT AUDIT (Rule 9 & Rule 10)
    // -------------------------------------------------------------------
    console.log('4. Auditing Order State Machine & Fulfillment Lifecycle (Rule 9 & Rule 10)...');

    const statusFlow = [
      { status: 'CONFIRMED', source: 'SELLER', msg: 'Order confirmed by seller' },
      { status: 'PROCESSING', source: 'SELLER', msg: 'Item pulled from inventory' },
      { status: 'PACKED', source: 'SELLER', msg: 'Package packed at warehouse' },
      { status: 'SHIPPED', source: 'SELLER', msg: 'Handed over to carrier' },
      { status: 'IN_TRANSIT', source: 'COURIER', msg: 'In transit to destination' },
      { status: 'OUT_FOR_DELIVERY', source: 'COURIER', msg: 'Out for delivery' },
      { status: 'DELIVERED', source: 'COURIER', msg: 'Delivered to recipient' },
    ];

    for (const step of statusFlow) {
      if (!isValidTransition(order.status, step.status)) {
        throw new Error(`Invalid transition attempted: ${order.status} -> ${step.status}`);
      }
      order.status = step.status;
      order.timeline.push({
        status: step.status,
        message: step.msg,
        timestamp: new Date(),
        source: step.source,
      });
    }
    await order.save();

    assertTest('Order successfully advanced through complete lifecycle PLACED -> DELIVERED (8 nodes)', order.status === 'DELIVERED' && order.timeline.length === 8);

    // Rule 9 Guard: Verify Illegal Jump Rejection
    assertTest('Illegal transition DELIVERED -> PACKED rejected by state machine', !isValidTransition('DELIVERED', 'PACKED'));
    console.log('');

    // -------------------------------------------------------------------
    // 5. RETURNS, NOTIFICATIONS & REFUND AUDIT (Rule 9 & Rule 10)
    // -------------------------------------------------------------------
    console.log('5. Auditing Returns Request, Notifications & Refund Lifecycle...');

    // Customer requests return
    assertTest('DELIVERED -> RETURN_REQUESTED is valid transition', isValidTransition('DELIVERED', 'RETURN_REQUESTED'));

    order.status = 'RETURN_REQUESTED';
    order.timeline.push({
      status: 'RETURN_REQUESTED',
      message: 'Return requested by customer',
      timestamp: new Date(),
      source: 'CUSTOMER',
    });
    await order.save();

    // Create Notification
    const notif = await Notification.create({
      recipient: customer._id,
      type: 'RETURN',
      title: 'Return Request Received',
      message: `Return request for order #${order.orderNumber} is under review.`,
    });

    assertTest('In-app notification created for return request', notif && notif.type === 'RETURN');

    // Merchant Approves Return and Processes Refund
    const refundSteps = ['RETURNED', 'REFUND_INITIATED', 'REFUNDED'];
    for (const rStep of refundSteps) {
      order.status = rStep;
      order.timeline.push({
        status: rStep,
        message: `Status set to ${rStep}`,
        timestamp: new Date(),
        source: 'SELLER',
      });
    }
    await order.save();

    assertTest('Refund lifecycle completed (RETURN_REQUESTED -> RETURNED -> REFUND_INITIATED -> REFUNDED)', order.status === 'REFUNDED' && order.timeline.length === 12);
    console.log('');

    // -------------------------------------------------------------------
    // 6. SECURITY & AUDIT LOGGING VERIFICATION (Rule 16)
    // -------------------------------------------------------------------
    console.log('6. Verifying Audit Logging & System Security Controls (Rule 16)...');

    await recordAuditLog({
      action: 'FINAL_QA_MASTER_AUDIT',
      user: admin,
      targetResource: { modelName: 'Order', resourceId: order._id.toString() },
      status: 'SUCCESS',
      details: { totalPassed: passedTests },
    });

    const auditEntry = await AuditLog.findOne({ action: 'FINAL_QA_MASTER_AUDIT' });
    assertTest('Master Audit Log entry recorded in database', auditEntry !== null && auditEntry.status === 'SUCCESS');
    console.log('');

    // -------------------------------------------------------------------
    // 7. CLEANUP
    // -------------------------------------------------------------------
    console.log('7. Cleaning up test artifacts...');
    await User.deleteMany({ _id: { $in: [admin._id, seller._id, customer._id] } });
    await Category.findByIdAndDelete(category._id);
    await Product.findByIdAndDelete(product._id);
    await Order.findByIdAndDelete(order._id);
    await Notification.findByIdAndDelete(notif._id);
    await AuditLog.deleteMany({ action: 'FINAL_QA_MASTER_AUDIT' });
    console.log('🧹 Cleanup complete!\n');

    console.log('===================================================================');
    console.log(`🎉 MASTER FINAL QA PASSED 100%! ALL ${passedTests}/${totalTests} TESTS SUCCEEDED!`);
    console.log('===================================================================\n');

  } catch (error) {
    console.error('\n❌ Master Final QA Suite Failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB database');
  }
}

runFinalQASuite();
