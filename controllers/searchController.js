const Product = require('../models/product');

/**GET /search?q=:query
 * Cette fonction recherche des produits en fonction d'un paramètre de requête et renvoie une réponse
 * JSON des produits correspondants.

 * Si le paramètre de requête `q` n'est pas fourni, une réponse JSON avec un message d'erreur
 * et un code d'erreur 400 est renvoyée. Si le paramètre de requête est fourni, une
 * recherche est effectuée sur la collection `Product` à l'aide d'une expression régulière insensible à
 * la casse pour faire correspondre le champ `title` avec la chaîne de requête. Les produits
 * correspondants sont renvoyés sous forme de réponse JSON.
 */

const searchProducts = (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Un paramètre de requête est requis' });
  }

  const query = q.replace(/%20/g, ' ');

  Product.find({ title: { $regex: `.*${query}.*`, $options: 'i' } })
    .then(products => {
      res.json(products);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    });
};

/* Exportation de l'objet qui contient les fonctions 
utilisées pour gérer différentes requêtes HTTP liées aux recherches de produits dans l'API.
*/
module.exports = {
  searchProducts,
};
