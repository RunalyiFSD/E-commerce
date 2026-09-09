import Product from '../models/product.model.js';

/**
 * @route   GET /api/products
 * @desc    Get products with search, category, price, and sorting filters
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, sortBy, sellerId } = req.query;

    const query = { status: 'ACTIVE' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (sellerId) {
      query.seller = sellerId;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'price-low') sort = { price: 1 };
    if (sortBy === 'price-high') sort = { price: -1 };
    if (sortBy === 'rating') sort = { rating: -1 };

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('seller', 'name storeName')
      .sort(sort);

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/products/:id
 * @desc    Get single product details
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate('category', 'name slug')
      .populate('seller', 'name storeName rating');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Private (SELLER / ADMIN)
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      images,
      category,
      inventory,
      SKU,
      specifications,
    } = req.body;

    if (!name || !description || price === undefined || !category || !SKU || !images || images.length === 0) {
      return res.status(400).json({ message: 'Name, description, price, category, SKU, and images are required' });
    }

    const existingSKU = await Product.findOne({ SKU: SKU.toUpperCase() });
    if (existingSKU) {
      return res.status(400).json({ message: 'Product with this SKU already exists' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      images,
      category,
      seller: req.user._id, // Automatic seller ownership assignment
      inventory: inventory || 0,
      SKU,
      specifications: specifications || [],
    });

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update product (Enforces seller ownership or Admin)
 * @access  Private (SELLER / ADMIN)
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ownership Rule: Seller can only edit their own product (Admin can edit any)
    if (req.user.role !== 'ADMIN' && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied: You do not own this product' });
    }

    const fields = ['name', 'description', 'price', 'discountPrice', 'images', 'category', 'inventory', 'status', 'specifications'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    res.status(200).json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete/Deactivate product (Enforces seller ownership or Admin)
 * @access  Private (SELLER / ADMIN)
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ownership Rule Check
    if (req.user.role !== 'ADMIN' && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied: You do not own this product' });
    }

    product.status = 'INACTIVE';
    await product.save();

    res.status(200).json({ message: 'Product deactivated successfully' });
  } catch (error) {
    next(error);
  }
};
