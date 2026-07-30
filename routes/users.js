const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { userSchemas } = require('../validations/userValidation');

// All routes require authentication
router.use(authenticate);

router.get('/me', UserController.getMe);
router.patch('/me', validate(userSchemas.update), UserController.updateMe);
router.delete('/me', validate(userSchemas.delete), UserController.deleteMe);

module.exports = router;
