const Joi = require('joi');

const authSchemas = {
  register: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(8)
      .max(100)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character',
        'any.required': 'Password is required'
      }),
    firstName: Joi.string()
      .min(1)
      .max(100)
      .optional()
      .messages({
        'string.min': 'First name must be at least 1 character'
      }),
    lastName: Joi.string()
      .min(1)
      .max(100)
      .optional()
      .messages({
        'string.min': 'Last name must be at least 1 character'
      })
  }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  })
};

module.exports = { authSchemas };
