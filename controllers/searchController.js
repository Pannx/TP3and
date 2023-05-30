const Product = require('../models/Product');

// GET /search?q=:query
const searchProducts = (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  Product.find({ title: { $regex: q, $options: 'i' } })
    .then(products => {
      res.json(products);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' });
    });
};

module.exports = {
  searchProducts,
};
