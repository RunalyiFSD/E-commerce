import mongoose from 'mongoose';
import { ALL_STATUSES } from '../utils/orderStatusMachine.js';

const trackingEventSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ALL_STATUSES,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    default: '',
  },
  source: {
    type: String,
    enum: ['CUSTOMER', 'SELLER', 'ADMIN', 'COURIER', 'SYSTEM'],
    default: 'SYSTEM',
  },
});

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'Product',
    required: false,
  },
  productId: {
    type: String,
    default: '',
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    payment: {
      transactionId: { type: String, required: true },
      method: { type: String, required: true },
      status: { type: String, required: true, default: 'COMPLETED' },
    },
    pricing: {
      subtotal: { type: Number, required: true },
      discountTotal: { type: Number, default: 0 },
      shippingCost: { type: Number, default: 0 },
      taxEstimate: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ALL_STATUSES,
      default: 'PLACED',
    },
    tracking: {
      trackingNumber: { type: String, default: '' },
      courier: { type: String, default: 'Amazon Logistics' },
      estimatedDeliveryDate: { type: String, default: '' },
      currentLocation: { type: String, default: '' },
      carrierPhone: { type: String, default: '' },
    },
    timeline: [trackingEventSchema], // Immutable append-oriented history per Rule 10
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
