import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Support development / demo token shortcut
      if (token && token.startsWith('demo-mock-')) {
        const demoRole = (req.headers['x-demo-role'] || 'CUSTOMER').toUpperCase();
        req.user = {
          _id: demoRole === 'ADMIN' ? '650000000000000000000001' : demoRole === 'SELLER' ? '650000000000000000000002' : '650000000000000000000003',
          name: demoRole === 'ADMIN' ? 'Platform Administrator' : demoRole === 'SELLER' ? 'Sony Direct Store' : 'Alex Johnson',
          email: demoRole === 'ADMIN' ? 'admin@amazon.com' : demoRole === 'SELLER' ? 'seller@sony.com' : 'alex@example.com',
          role: demoRole,
          storeName: demoRole === 'SELLER' ? 'Sony Official' : undefined,
        };
        return next();
      }

      const secret = process.env.JWT_SECRET || 'dev_secret_key_123456789_ecommerce';
      const decoded = jwt.verify(token, secret);

      // Attach user to request (excluding password)
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('[Auth Middleware Error]', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
