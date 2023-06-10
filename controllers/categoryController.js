const Category = require('../models/Category');

// GET /categories
const getCategories = (req, res) => {
  Category.find()
    .then(categories => {
      res.json(categories);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' });
    });
};

// GET /categories/:id
const getCategoryById = (req, res) => {
  const { id } = req.params;

  Category.findById(id)
    .then(category => {
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' });
    });
};

// POST /categories
const createCategory = (req, res) => {
  const { name } = req.body;

  const category = new Category({ name });

  category
    .save()
    .then(savedCategory => {
      res.json(savedCategory);
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: 'Internal server error' });
    });
};

// PUT /categories/:id
const updateCategory = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  Category.findByIdAndUpdate(id, { name }, { new: true })
    .then(updatedCategory => {
      if (!updatedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(updatedCategory);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' });
    });
};

// DELETE /categories/:id
const deleteCategory = (req, res) => {
  const { id } = req.params;

  Category.findByIdAndDelete(id)
    .then(deletedCategory => {
      if (!deletedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json({ message: 'Category deleted successfully' });
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' });
    });
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
