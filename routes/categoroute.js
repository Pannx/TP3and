const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const isAuth = require('../middleware/isAuth');

// GET /categories
router.get('/categories', CategoryController.getCategories);

// GET /categories/:id
router.get('/categories/:id', CategoryController.getCategoryById);

// POST /categories
router.post('/categories', isAuth, CategoryController.createCategory);

// PUT /categories/:id
router.put('/categories/:id', isAuth, CategoryController.updateCategory);

// DELETE /categories/:id
router.delete('/categories/:id', isAuth, CategoryController.deleteCategory);

module.exports = router;
