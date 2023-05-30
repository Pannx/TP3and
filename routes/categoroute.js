const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const isAuth = require('../middleware/isAuth');

// GET /categories
router.get('/', CategoryController.getCategories);

// GET /categories/:id
router.get('/:id', CategoryController.getCategoryById);

// POST /categories
router.post('/', isAuth, isAuth.isAdmin, CategoryController.createCategory);

// PUT /categories/:id
router.put('/:id', isAuth, isAuth.isAdmin, CategoryController.updateCategory);

// DELETE /categories/:id
router.delete('/:id', isAuth, isAuth.isAdmin, CategoryController.deleteCategory);

module.exports = router;
