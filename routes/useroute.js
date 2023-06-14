const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const isAuth = require('../middleware/isAuth');

//Routes qui correspondent aux endpoints de la collection Users dans Postman

// GET /users
router.get('/users', UserController.getUsers);

// GET /users/profil
router.get('/users/profil', isAuth, UserController.getProfile);

//GET /users/:id
router.get('/users/:id', UserController.getUser);

// PUT /users/:id
router.put('/users/:id', isAuth, UserController.updateUser);

// DELETE /users/:id
router.delete('/users/:id', isAuth, UserController.deleteUser);

// ROUTES POST

// POST /login
router.post('/login', UserController.login);

// POST /admin_login
router.post('/admin_login', UserController.adminLogin);

// POST /signup
router.post('/signup', UserController.signup);

// ROUTES CART

//GET /cart
router.get('/cart', isAuth, UserController.getCart);

//PUT /cart
router.put('/cart', isAuth, UserController.addToCart);

//DELETE /cart/:id'
router.delete('/cart/:id', isAuth, UserController.removeFromCart);

module.exports = router;
