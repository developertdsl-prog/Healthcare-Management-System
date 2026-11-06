const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'healthcare_jwt_secret_key_2024',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'healthcare_jwt_secret_key_2024');
      req.user = { userId: decoded.userId, role: decoded.role };
      next();
    } catch (ex) {
      res.status(400).json({ message: 'Invalid token.' });
    }
  } catch (ex) {
    res.status(500).json({ message: 'Error during authentication.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { authenticate, authorize, generateToken };