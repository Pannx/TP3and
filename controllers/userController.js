const User = require("../models/user");
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
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }

      // Create a new user
      bcrypt.hash(password, 10).then((hashedPassword) => {
        const user = new User({
          firstname,
          lastname,
          email,
          password: hashedPassword,
        });

        user.save()
        .then((savedUser) => {
          res.status(201).json({ message: "Utilisateur créé avec succès" });
        })
        .catch((error) => {
          res.status(500).json({ error: "Failed to save user to the database" });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to hash the password" });
    });
});
}
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
  const { userId } = req.user;
  const jeton = req.headers.authorization?.split(" ")[1];
  console.log(jeton);

  try {
    const decodedJeton = jwt.verify(jeton, secretKey);

    if (id && id !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const searchId = id || decodedJeton.userId;

    User.findById(searchId)
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
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

const getProfile = (req, res) => {
  const { userId } = req;

  User.findById(userId)
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

const updateUser = (req, res) => {
  const { id } = req.params;
  const { userId, isAdmin } = req;
  const { firstname, lastname, city } = req.body;

  if (!isAdmin && id !== userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  User.findByIdAndUpdate(id, { firstname, lastname, city }, { new: true })
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
  const { userId, isAdmin } = req;

  if (!isAdmin && id !== userId) {
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

module.exports = {
  login,
  signup,
  getUsers,
  getUser,
  getProfile,
  updateUser,
  deleteUser,
  createToken,
};
