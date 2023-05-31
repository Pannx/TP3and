const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const isAuth = require('../middleware/isAuth');

// GET /users
router.get('/users', UserController.getUsers);

// GET /users/:id or /users/profil

router.get('/users/profil', isAuth, UserController.getProfile);

router.get('/users/:id', UserController.getUser);

// PUT /users/:id
router.put('/users/:id', isAuth, UserController.updateUser);

// DELETE /users/:id
router.delete('/:id', isAuth, UserController.deleteUser);

// POST /login

router.post('/login', UserController.login);

router.post('/signup', UserController.signup);

module.exports = router;
