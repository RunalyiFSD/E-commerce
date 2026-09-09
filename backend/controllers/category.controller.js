import Category from '../models/category.model.js';

/**
 * @route   GET /api/categories
 * @desc    Get active platform categories
 * @access  Public
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ status: 'ACTIVE' })
      .populate('parentCategory', 'name slug')
      .sort({ name: 1 });

    res.status(200).json({
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/categories/:id
 * @desc    Get single category by ID or slug
 * @access  Public
 */
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({
      $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { slug: id }],
    }).populate('parentCategory', 'name slug');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ category });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/categories
 * @desc    Create new platform category
 * @access  Private (ADMIN only per Rule 8)
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, parentCategory } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const category = await Category.create({
      name,
      description,
      image,
      parentCategory: parentCategory || null,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/categories/:id
 * @desc    Update platform category
 * @access  Private (ADMIN only)
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, image, parentCategory, status } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (parentCategory !== undefined) category.parentCategory = parentCategory;
    if (status) category.status = status;

    await category.save();

    res.status(200).json({
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/categories/:id
 * @desc    Deactivate/delete category
 * @access  Private (ADMIN only)
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.status = 'INACTIVE';
    await category.save();

    res.status(200).json({ message: 'Category deactivated successfully' });
  } catch (error) {
    next(error);
  }
};
