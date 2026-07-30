class AppResponse {
  static success(res, message, data = null, statusCode = 200) {
    const response = {
      success: true,
      message
    };
    if (data) response.data = data;
    return res.status(statusCode).json(response);
  }

  static error(res, message, statusCode = 400, errors = null) {
    const response = {
      success: false,
      message
    };
    if (errors) response.errors = errors;
    return res.status(statusCode).json(response);
  }

  static created(res, message, data = null) {
    return this.success(res, message, data, 201);
  }

  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = 'Forbidden') {
    return this.error(res, message, 403);
  }

  static conflict(res, message = 'Conflict') {
    return this.error(res, message, 409);
  }

  static validationError(res, message = 'Validation failed', errors = null) {
    return this.error(res, message, 400, errors);
  }
}

module.exports = { AppResponse };
