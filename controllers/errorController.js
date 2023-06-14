"use strict"

/**Middleware de gestion des erreurs pour une application Node.js qui
 * recherche des types d'erreurs spécifiques et renvoie un message d'erreur et un code d'état
 * appropriés. 
 */
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

