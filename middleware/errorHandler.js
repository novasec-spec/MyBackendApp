const { logger } = require('../utils/logger');
const { AppResponse } = require('../utils/response');

class AppError extends Error {
  constructor(message, statusCode = 400, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  if (err instanceof AppError) {
    return AppResponse.error(res, err.message, err.statusCode, err.errors);
  }

  if (err.code === '23505') { // Unique violation
    return AppResponse.conflict(res, 'Resource already exists');
  }

  if (err.code === '23503') { // Foreign key violation
    return AppResponse.error(res, 'Invalid reference', 400);
  }

  if (err.code === '22P02') { // Invalid input
    return AppResponse.error(res, 'Invalid input format', 400);
  }

  // Default error
  return AppResponse.error(
    res,
    process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    500
  );
};

module.exports = { errorHandler, AppError };
