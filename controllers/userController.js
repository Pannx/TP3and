const User = require("../models/user");
const Product = require("../models/Product");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dot = require("dotenv").config();

const login = (req, res) => {
  const { email, password } = req.body;

  // Find the user based on the email
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Compare the provided password with the hashed password stored in the database
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
          }

          // Create and sign a JWT token
          const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
          );

          res.json({ token });
        })
        .catch((error) => {
          res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
};

const signup = (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // Check if the user with the same email already exists
  User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Create a new user
    bcrypt
      .hash(password, 10)
      .then((hashedPassword) => {
        const user = new User({
          firstname,
          lastname,
          email,
          password: hashedPassword,
        });

        user
          .save()
          .then((savedUser) => {
            res.status(201).json({ message: "Utilisateur créé avec succès" });
          })
          .catch((error) => {
            res
              .status(500)
              .json({ error: "Failed to save user to the database" });
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

// Example usage
//const name = "John Doe";
//const email = "johndoe@example.com";
//const token = createToken(name, email);

const getUsers = (req, res) => {
  User.find()
    .select("-email -password")
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
};

const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .select("-email -password")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
};

const getProfile = (req, res) => {
  const userId = req.user.userId
  console.log("user", req.user)

  User.findById(userId)
    .select("-email -password")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ error: "Internal server error" });
    });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { email, firstname, lastname, city } = req.body;

  if (id !== userId) {
    return res.status(403).json({ error: "Forbidden" });
  }
  
  User.findByIdAndUpdate(id, { email, firstname, lastname, city }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
};

const deleteUser = (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  if (id !== userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  User.findByIdAndDelete(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
};



const getCart = (req, res) => {
  const userId = req.user.userId;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return the user's cart
      res.json(user.cart);
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
};

const addToCart = (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.body;

  User.findById(userId)
    .then(async (user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
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

        res.json({ message: "Product added to cart successfully" });
      } catch (error) {
        res.status(500).json({ error: "Produit non disponible" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
};
      
const removeFromCart = (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  User.findById(userId)
    .then(async (user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      try {
        // Find the product in the database
        const product = await Product.findById(id);

        // Check if the product exists and is not sold
        if (!product || !product.isSold) {
          return res.status(404).json({ error: "Product not available" });
        }

        // Find the index of the product in the cart
        const productIndex = user.cart.findIndex(
          (item) => item.productId.toString() === id
        );

        if (productIndex === -1) {
          return res
            .status(404)
            .json({ error: "Product not found in the cart" });
        }

        // Remove the product from the cart
        user.cart.splice(productIndex, 1);
        await user.save();

        // Set the product's isSold field to false
        product.isSold = false;
        await product.save();

        res.json({ message: "Product removed from cart successfully" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
};



module.exports = {
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
