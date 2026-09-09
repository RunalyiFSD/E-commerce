import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrderTracking,
  trackByNumber,
  addTrackingEvent,
  getDeliveryManagement,
  requestReturn,
  processReturn,
} from '../controllers/order.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = express.Router();

// Public Tracking Lookup Endpoint
router.get('/track-lookup/:query', trackByNumber);

// Protected Routes
router.use(protect);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/deliveries/summary', requireRole('SELLER', 'ADMIN'), getDeliveryManagement);
router.get('/:id', getOrderById);
router.get('/:id/tracking', getOrderTracking);
router.patch('/:id/status', requireRole('SELLER', 'ADMIN'), updateOrderStatus);
router.post('/:id/tracking/events', requireRole('SELLER', 'ADMIN'), addTrackingEvent);
router.post('/:id/return', requestReturn);
router.patch('/:id/return', requireRole('SELLER', 'ADMIN'), processReturn);

export default router;

