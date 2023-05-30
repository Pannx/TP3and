"use strict"
// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID';
  }

  res.status(statusCode).json({ error: message });
};

module.exports = {
  errorHandler,
};

