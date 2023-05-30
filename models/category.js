const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
