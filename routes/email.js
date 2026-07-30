const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { EmailController } = require('../controllers/emailController');
const { emailSchemas } = require('../validations/emailValidation');

router.post(
  '/verify-email/request',
  authenticate,
  EmailController.requestVerification
);

router.post(
  '/verify-email',
  validate(emailSchemas.verify),
  EmailController.verifyEmail
);

router.post(
  '/forgot-password',
  validate(emailSchemas.forgotPassword),
  EmailController.forgotPassword
);

router.post(
  '/reset-password',
  validate(emailSchemas.resetPassword),
  EmailController.resetPassword
);

module.exports = router;
