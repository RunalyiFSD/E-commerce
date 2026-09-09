import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'dev_secret_key_123456789_ecommerce';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id, role }, secret, { expiresIn });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (Customer or Seller)
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, storeName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Role safety: Only CUSTOMER or SELLER via public registration
    const userRole = ['CUSTOMER', 'SELLER'].includes(role) ? role : 'CUSTOMER';

    if (userRole === 'SELLER' && !storeName) {
      return res.status(400).json({ message: 'Store name is required for Seller registration' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      storeName: userRole === 'SELLER' ? storeName : undefined,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeName: user.storeName,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Must explicitly select password because select: false in model
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeName: user.storeName,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user profile
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        storeName: req.user.storeName,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Public
 */
export const logout = async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};
