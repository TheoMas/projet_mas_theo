// JWT middleware for Node.js (Express)
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '30m';

function generateToken(user) {
  return jwt.sign(
    {
      user_id: user.id,
      email: user.email,
      role_id: user.role_id,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Token manquant' });
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
  }
  req.user = decoded;
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role_id !== 1) {
    return res.status(403).json({ success: false, message: 'Accès refusé - Droits administrateur requis' });
  }
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  authenticateJWT,
  requireAdmin,
};
