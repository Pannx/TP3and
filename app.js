'use strict';

const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Import the routes
const indexRoutes = require('./routes/useroute');

// Import the error controller
const errorController = require('./controllers/errorController');

// Middleware for parsing JSON requests
app.use(express.json());

// Middleware for parsing urlencoded requests
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(indexRoutes);

// Error handling middleware
app.use(errorController.errorHandler);

// Connect to MongoDB and start the server
mongoose
  .connect('mongodb://127.0.0.1:27017/testdw3')
  .then(() => {
    console.log('Connected to the database');
    app.listen(3002, () => {
      console.log('Server is listening on port 3000');
    });
  })
  .catch(err => {
    console.error('Failed to connect to the database', err);
  });

