const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      // Handle expired token specifically
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Token expired, please login again',
          code: 'TOKEN_EXPIRED',
        });
      }
      return res.status(401).json({
        message: 'Not authorized, token failed',
        code: 'TOKEN_INVALID',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: 'Not authorized, no token',
      code: 'NO_TOKEN',
    });
  }
};

module.exports = { protect };
