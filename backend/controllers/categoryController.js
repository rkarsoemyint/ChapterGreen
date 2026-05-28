const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 }); 
        res.status(200).json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin Only)
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        
        const existing = await Category.findOne({ name });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Category already exists' });
        }

        const category = await Category.create({ name });
        res.status(201).json({ success: true, data: category });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin Only)
exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        
        let category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        const existing = await Category.findOne({ name, _id: { $ne: req.params.id } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Category name already exists' });
        }

        category = await Category.findByIdAndUpdate(
            req.params.id, 
            { name }, 
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin Only)
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        await category.deleteOne();
        res.status(200).json({ success: true, message: 'Category removed successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};