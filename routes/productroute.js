const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const authMiddleware = require('../middleware/isAuth');
const isAuth = require('../middleware/isAuth');
const searchController = require('../controllers/searchController');

//Routes qui correspondent aux endpoints de la collection Products dans Postman

// GET /products
router.get('/products', ProductController.getProducts);

// GET /products/:id
router.get('/products/:id', ProductController.getProductById);

// POST /products
router.post('/products', isAuth, ProductController.createProduct);

// DELETE /products/:id
router.delete('/products/:id', isAuth, ProductController.deleteProduct);

// GET /products/user/:userId
router.get('/products/user/:userId', ProductController.getProductsByUser);

// GET /search?q=:query
router.get('/search', searchController.searchProducts);


module.exports = router;
