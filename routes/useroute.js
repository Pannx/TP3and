const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const isAuth = require('../middleware/isAuth');

// GET /users
router.get('/users', UserController.getUsers);

// GET /users/:id or /users/profil
router.get('/:id?', isAuth, UserController.getUser);

// PUT /users/:id
router.put('/:id', isAuth, UserController.updateUser);

// DELETE /users/:id
router.delete('/:id', isAuth, UserController.deleteUser);

module.exports = router;
