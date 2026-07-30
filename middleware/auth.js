const jwt = require('jsonwebtoken');
const { AppResponse } = require('../utils/response');
const { logger } = require('../utils/logger');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return AppResponse.unauthorized(res, 'Access token required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return AppResponse.unauthorized(res, 'Access token required');
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return AppResponse.unauthorized(res, 'Access token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      return AppResponse.unauthorized(res, 'Invalid access token');
    }
    logger.error('Auth middleware error:', error);
    return AppResponse.unauthorized(res, 'Authentication failed');
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = decoded;
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = { authenticate, optionalAuth };
