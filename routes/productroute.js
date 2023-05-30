const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const authMiddleware = require('../middleware/isAuth');
const isAuth = require('../middleware/isAuth');

// GET /products
router.get('/', ProductController.getProducts);

// GET /products/:id
router.get('/:id', ProductController.getProductById);

// POST /products
router.post('/', isAuth, ProductController.createProduct);

// DELETE /products/:id
router.delete('/:id', isAuth, ProductController.deleteProduct);

// GET /products/user/:userId
router.get('/user/:userId', ProductController.getProductsByUser);

module.exports = router;
