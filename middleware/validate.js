const { AppResponse } = require('../utils/response');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));

      return AppResponse.validationError(
        res,
        'Validation failed',
        errors
      );
    }

    req.body = value;
    next();
  };
};

module.exports = { validate };
