"use strict";

const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader('Access-Control-Allow-Origin', 'https://monsupersite.com');

  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});



// Import the routes
const userRoutes = require("./routes/useroute");
const productRoutes = require("./routes/productroute");
const categoRoutes = require("./routes/categoroute");


// Import the error controller
const errorController = require("./controllers/errorController");

// Middleware for parsing JSON requests
app.use(express.json());

// Middleware for parsing urlencoded requests
app.use(express.urlencoded({ extended: false }));



// Routes
app.use(userRoutes);

app.use(productRoutes);

app.use(categoRoutes);

// Error handling middleware
app.use(errorController.errorHandler);

const PORT = process.env.PORT || 3002;
// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGODBATLAS)
  .then(() => {
    console.log("Connected to the database");
    app.listen(3002, () => {
      console.log("Server is listening on port 3002");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
