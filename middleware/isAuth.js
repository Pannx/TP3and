"use strict";

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/** Vérifie si la requête a un token JWT valide */

/* Cette ligne de code exporte une fonction middleware utilisée pour vérifier si la requête a un
jeton JWT valide dans l'en-tête "Authorization". Si le jeton est valide, il décode le jeton et le
transmet à l'objet `req` pour une utilisation dans d'autres parties de l'application. Si le jeton
n'est pas valide, il génère une erreur. La fonction `next()` est appelée pour passer le contrôle à
la prochaine fonction middleware de la pile. */

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  console.log('authHeader', authHeader)
  if (!authHeader) {
    res.status(401).json({ error: 'Non authentifié..' });
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Non authentifié.');
    error.statusCode = 401;
    throw error;
  }
  // Passe le token décodé dans la requête pour pouvoir l'utiliser ailleurs
  req.user = decodedToken;
  console.log('decodedToken', decodedToken)
  next();
};
