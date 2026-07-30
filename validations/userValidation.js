const Joi = require('joi');

const userSchemas = {
  update: Joi.object({
    firstName: Joi.string()
      .min(1)
      .max(100)
      .optional(),
    lastName: Joi.string()
      .min(1)
      .max(100)
      .optional(),
    currentPassword: Joi.string()
      .optional()
      .when('newPassword', {
        is: Joi.exist(),
        then: Joi.required()
      }),
    newPassword: Joi.string()
      .min(8)
      .max(100)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .optional()
      .messages({
        'string.min': 'New password must be at least 8 characters',
        'string.pattern.base': 'New password must contain uppercase, lowercase, number and special character'
      })
  }),

  delete: Joi.object({
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required to delete account'
      })
  })
};

module.exports = { userSchemas };
