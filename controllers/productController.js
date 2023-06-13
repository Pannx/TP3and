const Product = require("../models/product");

// GET /products
const getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.json(products);
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
};

// GET /products/:id
const getProductById = (req, res) => {
  const { id } = req.params;

  Product.findById(id)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
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
    userId,
  });

  product
    .save()
    .then((savedProduct) => {
      res.status(201).json(savedProduct);
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
};

// DELETE /products/:id
const deleteProduct = (req, res) => {
  const {id} = req.params;
  const userId = req.user.userId;

  Product.findById(id)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      console.log(product.userId.toString());
      console.log(userId);
      if (product.userId.toString() !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      return Product.findByIdAndDelete(id);
    })
    .then((deletedProduct) => {
      if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

// GET /products/user/:userId
const getProductsByUser = (req, res) => {
  const { userId } = req.params;

  Product.find({ userId })
    .then((products) => {
      res.json(products);
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  getProductsByUser,
};
