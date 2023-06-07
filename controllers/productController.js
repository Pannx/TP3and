const Product = require('../models/Product');

// GET /products
const getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.json(products);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' });
    });
};

// GET /products/:id
const getProductById = (req, res) => {
  const { id } = req.params;

  Product.findById(id)
    .then(product => {
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' });
    });
};

// POST /products
const createProduct = (req, res) => {
  const { title, description, price, imageUrl, categoryId } = req.body;
  const userId = req.user.userId;

  const product = new Product({
    title,
    description,
    price,
    imageUrl,
    categoryId,
    userId
  });

  product
    .save()
    .then(savedProduct => {
      res.json(savedProduct);
    })
    .catch(error => {
      console.error(error); // Log the error to the console for debugging purposes
      res.status(500).json({ error: 'Internal server error' });
    });
};

// DELETE /products/:id
const deleteProduct = (req, res) => {
  const { id } = req.params;
  const { userId, isAdmin } = req;

  Product.findById(id)
    .then(product => {
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (!isAdmin && product.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      return Product.findByIdAndDelete(id);
    })
    .then(deletedProduct => {
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' });
    });
};

// GET /products/user/:userId
const getProductsByUser = (req, res) => {
  const { userId } = req.params;

  Product.find({ userId })
    .then(products => {
      res.json(products);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' });
    });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  getProductsByUser,
};
