const Product = require("../models/product");

/**GET /products
 * Fonction qui récupère tous les produits de la base de données et les envoie sous forme de
 * réponse JSON, ou renvoie un message d'erreur en cas d'erreur de serveur.
 * La fonction utilise le modèle `Product` pour trouver tous les utilisateurs dans la base de données et les renvoie sous forme de réponse JSON.
 */
const getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.json(products);
    })
    .catch((error) => {
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/**GET /products/:id
 * Fonction qui récupère un produit par son id et le renvoie sous forme d'objet JSON, ou renvoie un
 * message d'erreur si le produit n'est pas trouvé ou s'il y a une erreur interne du serveur.
 */
const getProductById = (req, res) => {
  const { id } = req.params;

  Product.findById(id)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: "Produit non trouvé" });
      }
      res.json(product);
    })
    .catch((error) => {
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/**POST /products
 * Fonction qui crée un nouveau produit et l'enregistre dans la base de données. L'utilisateur doit être connecté.
 * Si tous les champs de la req ne sont pas remplis, renvoie un message d'erreur.
 */
const createProduct = (req, res) => {
  const { title, description, price, imageUrl, categoryId } = req.body;
  const userId = req.user.userId;

  if (!req.user) {
    return res.status(401).json({ error: "Vous devez être connecté(e)." });
  }

  if (!title || !description || !price || !imageUrl || !categoryId) {
    return res
      .status(422)
      .json({ error: "Tous les champs doivent être remplis." });
  }

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
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/**DELETE /products/:id
 * Fonction qui supprime un produit de la base de données si l'utilisateur qui en fait la demande est
 * le propriétaire du produit. S'il ne l'est pas, la suppression est interdite.
 */
const deleteProduct = (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  Product.findById(id)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: "Produit non trouvé" });
      }
      console.log(product.userId.toString());
      console.log(userId);
      if (product.userId.toString() !== userId) {
        return res.status(403).json({ error: "Suppression interdite" });
      }

      return Product.findByIdAndDelete(id);
    })
    .then((deletedProduct) => {
      if (!deletedProduct) {
        return res.status(404).json({ error: "Produit non trouvé" });
      }
      res.status(204);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/**GET /products/user/:userId
 * Fonction qui récupère les produits associés à un id utilisateur et les envoie sous
 * forme de réponse JSON, ou renvoie un message d'erreur s'il y a problème.
 */
const getProductsByUser = (req, res) => {
  const { userId } = req.params;

  Product.find({ userId })
    .then((products) => {
      res.json(products);
    })
    .catch((error) => {
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/* Exportation de l'objet qui contient les fonctions
utilisées pour gérer différentes requêtes HTTP liées aux produits dans l'API.
*/
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  getProductsByUser,
};
