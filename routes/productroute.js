const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const authMiddleware = require('../middleware/isAuth');
const isAuth = require('../middleware/isAuth');

// GET /products
router.get('/products', ProductController.getProducts);

// GET /products/:id
router.get('/products/:id', ProductController.getProductById);

// POST /products
router.post('/products', isAuth, ProductController.createProduct);

// DELETE /products/:id
router.delete('/:id', isAuth, ProductController.deleteProduct);

// GET /products/user/:userId
router.get('/user/:userId', ProductController.getProductsByUser);

module.exports = router;
