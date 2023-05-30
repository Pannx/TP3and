const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50
  },
  firstname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  lastname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true
  },
  city: {
    type: String,
    maxlength: 50
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
