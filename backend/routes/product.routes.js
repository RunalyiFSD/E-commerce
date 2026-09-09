import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (SELLER & ADMIN)
router.post('/', protect, requireRole('SELLER', 'ADMIN'), createProduct);
router.put('/:id', protect, requireRole('SELLER', 'ADMIN'), updateProduct);
router.delete('/:id', protect, requireRole('SELLER', 'ADMIN'), deleteProduct);

export default router;
