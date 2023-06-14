const Category = require("../models/category");

/**GET /categories
 * Fonction qui récupère toutes les catégories de la base de données et les envoie sous forme de
 * réponse JSON, ou renvoie un message d'erreur en cas d'erreur de serveur.
 * La fonction utilise le modèle `Category` pour trouver tous les utilisateurs dans la base de données et les renvoie sous forme de réponse JSON.
 */
const getCategories = (req, res) => {
  Category.find()
    .then((categories) => {
      res.json(categories);
    })
    .catch((error) => {
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/**GET /categories/:id
 * Fonction qui récupère une catégorie par son id et la renvoie sous la forme d'un objet JSON, ou
 * renvoie un message d'erreur si la catégorie n'est pas trouvée ou s'il y a une erreur interne du
 * serveur.
 */
const getCategoryById = (req, res) => {
  const { id } = req.params;

  Category.findById(id)
    .then((category) => {
      if (!category) {
        return res.status(404).json({ error: "Catégorie non trouvée" });
      }
      res.json(category);
    })
    .catch((error) => {
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/**POST /categories
 * Fonction qui crée une nouvelle catégorie dans la BD en enregistrant le nom fourni dans le body de la req
 * Renvoie un message d'erreur si l'utilisateur n'est pas l'admin.
 */
const createCategory = (req, res) => {
  // Check if the user is the admin
  const isAdmin = req.user.isAdmin; // Assuming the user object has an 'isAdmin' property

  if (!isAdmin) {
    // If the user is not the admin, send an error message
    return res
      .status(403)
      .json({ error: "Vous n'êtes pas autorisé(e) à créer une catégorie." });
  }

  const { name } = req.body;

  const category = new Category({ name });

  category
    .save()
    .then((savedCategory) => {
      res.status(201).json(savedCategory);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/**PUT /categories/:id
 * Fonction qui modifie le nom d'une catégorie et renvoie la catégorie mise
 * à jour ou un message d'erreur.
 */
const updateCategory = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  Category.findByIdAndUpdate(id, { name }, { new: true })
    .then((updatedCategory) => {
      if (!updatedCategory) {
        return res.status(404).json({ error: "Catégorie non trouvée" });
      }
      res.json(updatedCategory);
    })
    .catch((error) => {
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/**DELETE /categories/:id
 * La fonction qui supprime une catégorie par son id et renvoie un message d'erreur si la catégorie
 * n'est pas trouvée ou s'il y a une erreur interne du serveur.
 */
const deleteCategory = (req, res) => {
  const { id } = req.params;

  Category.findByIdAndDelete(id)
    .then((deletedCategory) => {
      if (!deletedCategory) {
        return res.status(404).json({ error: "Catégorie non trouvée" });
      }
      res.status(204).send();
    })
    .catch((error) => {
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/* Exportation de l'objet qui contient les fonctions 
utilisées pour gérer différentes requêtes HTTP liées aux catégories dans l'API.
*/
module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
