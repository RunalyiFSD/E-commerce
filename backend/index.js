import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import rbacRoutes from './routes/rbac_demo.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import notificationRoutes from './routes/notification.routes.js';

import { createRateLimiter } from './middleware/rateLimit.middleware.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Essential Security & Logging Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Global & Specific Rate Limiters
const isProd = process.env.NODE_ENV === 'production';
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 20 : 500,
  message: 'Too many authentication attempts. Please try again later.',
});
const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 200 : 2000,
  message: 'API rate limit exceeded. Please slow down.',
});

app.use('/api', apiLimiter);

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/rbac', rbacRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

// Root fallback route
app.get('/', (req, res) => {
  res.send('Amazon E-Commerce REST API Engine Active');
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
    },
  });
});

app.listen(PORT, () => {
  console.log(`[Server] Express API server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
