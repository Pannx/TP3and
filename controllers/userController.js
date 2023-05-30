const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dot = require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const getUsers = (req, res) => {
  User.find()
    .select('-email -password')
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' });
    });
};

const getUser = (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const jeton = req.headers.authorization?.split(' ')[1];
  console.log(jeton);

  try {
    const decodedJeton = jwt.verify(jeton, secretKey);

    if (id && id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const searchId = id || decodedJeton.userId;

    User.findById(searchId)
      .select('-email -password')
      .then(user => {
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
      })
      .catch(error => {
        res.status(500).json({ error: 'Internal server error' });
      });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const getProfile = (req, res) => {
  const { userId } = req;

  User.findById(userId)
    .select('-email -password')
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' });
    });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const { userId, isAdmin } = req;
  const { firstname, lastname, city } = req.body;

  if (!isAdmin && id !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  User.findByIdAndUpdate(id, { firstname, lastname, city }, { new: true })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' });
    });
};

const deleteUser = (req, res) => {
  const { id } = req.params;
  const { userId, isAdmin } = req;

  if (!isAdmin && id !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  User.findByIdAndDelete(id)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' });
    });
};

module.exports = {
  getUsers,
  getUser,
  getProfile,
  updateUser,
  deleteUser,
};



