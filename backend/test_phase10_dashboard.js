import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from './models/user.model.js';
import Product from './models/product.model.js';
import Category from './models/category.model.js';
import Order from './models/order.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_db';

async function runPhase10DashboardTests() {
  console.log('--- STARTING PHASE 10 DASHBOARD ANALYTICS EMPIRICAL TESTS ---');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Fetch or create test users
    const customer = await User.findOneAndUpdate(
      { email: 'dash_customer@example.com' },
      { name: 'Dash Customer', email: 'dash_customer@example.com', password: 'password123', role: 'CUSTOMER' },
      { upsert: true, new: true }
    );

    const seller = await User.findOneAndUpdate(
      { email: 'dash_seller@example.com' },
      { name: 'Dash Seller', storeName: 'Tech Pro Store', email: 'dash_seller@example.com', password: 'password123', role: 'SELLER' },
      { upsert: true, new: true }
    );

    const admin = await User.findOneAndUpdate(
      { email: 'dash_admin@example.com' },
      { name: 'Dash Admin', email: 'dash_admin@example.com', password: 'password123', role: 'ADMIN' },
      { upsert: true, new: true }
    );

    console.log('✅ Mock users for dashboard verified');

    // 2. Setup Category & Product
    const category = await Category.findOneAndUpdate(
      { slug: 'dashboard-gadgets' },
      { name: 'Dashboard Gadgets', slug: 'dashboard-gadgets', createdBy: admin._id },
      { upsert: true, new: true }
    );

    const productLowStock = await Product.findOneAndUpdate(
      { SKU: 'DASH-SKU-LOW' },
      {
        $set: {
          name: 'Smart Desk Lamp',
          slug: 'smart-desk-lamp',
          description: 'Dimmable LED lamp',
          price: 49.99,
          category: category._id,
          seller: seller._id,
          inventory: 3, // Low stock <= 5
          stock: 3,
          SKU: 'DASH-SKU-LOW',
        },
      },
      { upsert: true, new: true }
    );

    console.log('✅ Low stock product configured:', productLowStock);

    // 3. Create active test order
    const orderNum = `AMZ-2026-DASH${Math.floor(1000 + Math.random() * 9000)}`;
    const testOrder = await Order.create({
      orderNumber: orderNum,
      customer: customer._id,
      items: [
        {
          product: productLowStock._id,
          productName: productLowStock.name,
          quantity: 1,
          price: productLowStock.price,
          seller: seller._id,
        },
      ],
      shippingAddress: {
        fullName: 'Dash Customer',
        street: '100 Main St',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        phone: '555-0100',
      },
      payment: {
        transactionId: `TXN-DASH-${Date.now()}`,
        method: 'CARD',
        status: 'COMPLETED',
      },
      pricing: {
        subtotal: 49.99,
        discountTotal: 0,
        shippingCost: 5.00,
        taxEstimate: 4.00,
        total: 58.99,
      },
      status: 'SHIPPED',
      tracking: {
        trackingNumber: 'TRK-DASH-123',
        courier: 'Amazon Logistics',
        estimatedDeliveryDate: '2 Days',
        currentLocation: 'Sort Facility',
      },
      timeline: [
        { status: 'PLACED', message: 'Order Placed', timestamp: new Date(), source: 'CUSTOMER' },
        { status: 'SHIPPED', message: 'Shipped out', timestamp: new Date(), source: 'SELLER' },
      ],
    });

    console.log(`✅ Test order ${testOrder.orderNumber} created`);

    // 4. Test Customer Stats Query
    const customerOrderCount = await Order.countDocuments({ customer: customer._id });
    const activeShipmentsCount = await Order.countDocuments({
      customer: customer._id,
      status: { $in: ['CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'] },
    });
    if (customerOrderCount < 1 || activeShipmentsCount < 1) {
      throw new Error('Customer dashboard analytics query failed!');
    }
    console.log(`✅ Customer Analytics Verified (Total Orders: ${customerOrderCount}, Active Shipments: ${activeShipmentsCount})`);

    // 5. Test Seller Stats Query
    const sellerOrderCount = await Order.countDocuments({ 'items.seller': seller._id });
    const lowStockCount = await Product.countDocuments({ seller: seller._id, $or: [{ inventory: { $lte: 5 } }, { stock: { $lte: 5 } }] });
    if (sellerOrderCount < 1 || lowStockCount < 1) {
      throw new Error('Seller dashboard analytics query failed!');
    }
    console.log(`✅ Seller Analytics Verified (Store Orders: ${sellerOrderCount}, Low Stock Alerts: ${lowStockCount})`);

    // 6. Test Admin Platform Query
    const totalUsers = await User.countDocuments({ role: 'CUSTOMER' });
    const totalSellers = await User.countDocuments({ role: 'SELLER' });
    const totalCategories = await Category.countDocuments();
    if (totalUsers < 1 || totalSellers < 1 || totalCategories < 1) {
      throw new Error('Admin dashboard analytics query failed!');
    }
    console.log(`✅ Admin Platform Metrics Verified (Customers: ${totalUsers}, Sellers: ${totalSellers}, Categories: ${totalCategories})`);

    // Clean up test order
    await Order.findByIdAndDelete(testOrder._id);
    console.log('🧹 Cleaned up test dashboard order');

    console.log('--- ALL PHASE 10 DASHBOARD ANALYTICS TESTS PASSED 100% ---');
  } catch (error) {
    console.error('❌ Phase 10 Test Failure:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

runPhase10DashboardTests();
