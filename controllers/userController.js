const User = require("../models/user");
const Product = require("../models/product");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dot = require("dotenv").config();

/**POST /admin_login
 * La fonction adminLogin extrait l'email et le mot de passe du corps de la requête. Si l'email ne correspond pas à celui
 * de l'admin unique dans l'API, la requête échoue et renvoie un message d'erreur. Si la requête réussit, elle génère un token.
 */
const adminLogin = (req, res) => {
  const { email, password } = req.body;

  // Trouve l'admin dans la DB
  User.findOne({ email, isAdmin: true })
    .then((adminUser) => {
      if (!adminUser) {
        return res.status(401).json({ error: "Autorisation invalide" });
      }

      // Compare le mot de passe entré avec le hashed dans la DB
      bcrypt
        .compare(password, adminUser.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(401).json({ error: "Autorisation invalide" });
          }

          // Génère un token
          const token = jwt.sign(
            { userId: adminUser._id, isAdmin: true },
            process.env.SECRET_KEY
          );

          // Envoi du token comme réponse
          res.json({ token });
        })
        .catch((error) => {
          res.status(500).json({ error: "Erreur interne du serveur" });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/* POST /login 
Fonction utilisée pour la connexion de l'utilisateur en fonction de l'e-mail et du mot de passe de la requête.
Elle trouve l'utilisateur avec l'e-mail correspondant dans la base de données et compare le
mot de passe fourni avec le mot de passe haché stocké dans la base de données. Si les mots de passe
correspondent, il crée et signe un jeton JWT et le renvoie en réponse. Si les mots de passe ne
correspondent pas, il envoie une réponse d'erreur. */
const login = (req, res) => {
  const { email, password } = req.body;

  // Trouve l'utilisateur avec l'email
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      // Compare le mot de passe de l'utilisateur avec le hashed password de la DB
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(401).json({ error: "Autorisation invalide" });
          }

          // Crée et signe un JWT token
          const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
          );

          res.json({ token });
        })
        .catch((error) => {
          res.status(500).json({ error: "Erreur interne du serveur" });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/* POST/ signup
Fonction qui permet de gérer la logique de création d'un nouveau compte utilisateur. Il extrait les informations
nécessaires du corps de la requête, vérifie si un utilisateur avec le même e-mail existe déjà dans la base de
données, hache le mot de passe de l'utilisateur, puis crée un nouvel objet utilisateur et
l'enregistre dans la base de données. */
const signup = (req, res) => {
  const { firstname, lastname, email, password, city } = req.body;

  // Vérifie si le user avec l'email existe deja
  User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res.status(409).json({ error: "L'utilisateur existe déjà" });
    }

    // Crée un nouvel utilisateur
    bcrypt
      .hash(password, 10)
      .then((hashedPassword) => {
        const user = new User({
          firstname,
          lastname,
          email,
          password: hashedPassword,
          city,
        });

        user
          .save()
          .then((savedUser) => {
            res.status(201).json({ message: "Utilisateur créé avec succès" });
          })
          .catch((error) => {
            res
              .status(500)
              .json({ error: "Échec de la création de l'utilisateur" });
          });
      })
      .catch((error) => {
        res.status(500).json({ error: "Failed to hash the password" });
      });
  });
};
const createToken = (name, email) => {
  const payload = {
    name: name,
    email: email,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });

  return token;
};

/* GET/ users 
Fonction qui récupère et renvoie tous les utilisateurs de la BD quand une requête GET est lancée. 
La fonction utilise le modèle `User` pour trouver tous les utilisateurs dans la base de données et les renvoie sous forme de réponse JSON. */
const getUsers = (req, res) => {
  User.find()
    .select("-email -password")
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/* GET /users/:id
Fonction qui récupère un seul utilisateur de la BD par son id passé en paramètres. 
*/
const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .select("-email -password")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.json(user);
    })
    .catch((error) => {
      if (error.name === "CastError" && error.kind === "ObjectId") {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/*GET /users/profil 
Fonction qui récupère les informations de
profil d'un utilisateur connecté. Elle extrait l'ID utilisateur du jeton JWT dans l'en-tête de la demande,
trouve l'utilisateur dans la base de données à l'aide de l'ID et renvoie les informations de profil
de l'utilisateur. */
const getProfile = (req, res) => {
  const userId = req.user.userId;
  console.log("user", req.user);

  User.findById(userId)
    .select("-email -password")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(403).json({ error: "Non autorisé" });
    });
};

/* PUT /users/:id
Fonction qui gère la logique de mise à jour des informations d'un
utilisateur dans la base de données. L'utilisateur peut changer les infos qui sont dans le corps de la requête
Exclut le mot de passe pour les fins de ce travail et le champ isAdmin*/
const updateUser = (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { email, firstname, lastname, city } = req.body;

  if (id !== userId) {
    return res.status(403).json({ error: "La mise à jour est interdite" });
  }

  User.findByIdAndUpdate(
    id,
    { email, firstname, lastname, city },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/* DELETE /users/:id
Fonction qui supprime l'utilisateur de la BD. Elle extrait l'id utilisateur des paramètres de la demande et vérifie que l'utilisateur
qui fait la demande est autorisé à supprimer l'utilisateur. 
Dans ce cas-ci seul l'utilisateur connecté peut se supprimer lui-même */
const deleteUser = (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  if (id !== userId) {
    return res.status(403).json({ error: "La supression est interdite" });
  }

  User.findByIdAndDelete(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.status(204);
    })
    .catch((error) => {
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/*GET /cart
Fonction qui gère une requête GET pour récupérer le panier d'un
utilisateur en fonction de son id. Il prend les objets de requête et de réponse en tant que paramètres et utilise la
propriété `req.user.userId` pour trouver l'utilisateur dans la base de données et renvoyer son
panier. ()`. */
const getCart = (req, res) => {
  const userId = req.user.userId;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      // Retourne le panier de l'utilisateur
      res.json(user.cart);
    })
    .catch((error) => {
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/*PUT /cart 
Fonction qui ajoute un produit au panier d'un
utilisateur. Il prend les objets de demande et de réponse en tant que paramètres, extrait l'ID
utilisateur de l'objet de demande, trouve l'utilisateur dans la base de données, puis ajoute l'ID de
produit au tableau de panier de l'utilisateur. Il définit également la propriété "isSold" du produit
sur "true" pour indiquer qu'il a été vendu. */
const addToCart = (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.body;

  User.findById(userId)
    .then(async (user) => {
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      try {
        // Trouver le produit dans la base de données
        const product = await Product.findById(productId);

        // Vérifie si le produit existe et qu'il n'est pas vendu
        if (!product || product.isSold) {
          return res.status(404).json({ error: "Produit non disponible" });
        }

        // Ajouter le produit au panier et définir isSold sur true
        user.cart.push(productId);
        await user.save();

        // Définir le champ isSold du produit sur true
        product.isSold = true;
        await product.save();

        res.json({ message: "Le produit a été ajouté au panier !" });
      } catch (error) {
        res.status(500).json({ error: "Produit non disponible" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/* DELETE /cart/:id'
Fonction qui gère une requête DELETE pour supprimer un produit du
panier d'un utilisateur. Il prend les objets de requête et de réponse comme paramètres, extrait l'ID
utilisateur de l'objet de requête, trouve l'utilisateur dans la base de données et supprime l'ID de
produit du tableau de panier de l'utilisateur. 
*/
const removeFromCart = (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.params;

  User.findById(userId)
    .then(async (user) => {
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      try {
        const indice = user.cart.indexOf(productId);
        user.cart.splice(indice, 1);
        await user.save();

        res.json({ message: "Le produit a été retiré du panier" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erreur interne du serveur" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

/* Exportation de l'objet qui contient les fonctions 
utilisées pour gérer différentes requêtes HTTP liées aux utilisateurs.
*/

module.exports = {
  adminLogin,
  login,
  signup,
  getUsers,
  getUser,
  getProfile,
  updateUser,
  deleteUser,
  createToken,
  getCart,
  addToCart,
  removeFromCart,
};
