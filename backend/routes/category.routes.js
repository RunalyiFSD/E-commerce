import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin-only protected routes (Rule 8 enforcement)
router.post('/', protect, requireRole('ADMIN'), createCategory);
router.put('/:id', protect, requireRole('ADMIN'), updateCategory);
router.delete('/:id', protect, requireRole('ADMIN'), deleteCategory);

export default router;
