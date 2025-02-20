const jwt = require('jsonwebtoken');
const config = require('./app');

const createToken = ({ email, userId }) => {
  return jwt.sign({ email, userId }, config.jwt.secret, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

module.exports = { createToken, verifyToken };
