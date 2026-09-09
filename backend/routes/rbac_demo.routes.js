import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = express.Router();

// Admin Only Route
router.get('/admin-only', protect, requireRole('ADMIN'), (req, res) => {
  res.status(200).json({
    message: 'Welcome Admin! You have platform-wide access.',
    actor: req.user.name,
    role: req.user.role,
  });
});

// Seller or Admin Route
router.get('/seller-only', protect, requireRole('SELLER', 'ADMIN'), (req, res) => {
  res.status(200).json({
    message: 'Merchant Fulfillment Portal Access Granted.',
    actor: req.user.name,
    role: req.user.role,
  });
});

// Customer or Admin Route
router.get('/customer-only', protect, requireRole('CUSTOMER', 'ADMIN'), (req, res) => {
  res.status(200).json({
    message: 'Customer Account Portal Access Granted.',
    actor: req.user.name,
    role: req.user.role,
  });
});

export default router;
