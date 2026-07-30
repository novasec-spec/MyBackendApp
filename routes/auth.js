const express = require('express');
const router = express.Router();
const { AuthController } = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authSchemas } = require('../validations/authValidation');
// In routes/auth.js, add JSDoc comments for Swagger

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already registered
 */
// Public routes
router.post('/register', validate(authSchemas.register), AuthController.register);
router.post('/login', validate(authSchemas.login), AuthController.login);

// Protected routes
router.post('/refresh', authenticate, AuthController.refresh);
router.post('/logout', authenticate, AuthController.logout);
router.post('/logout-all', authenticate, AuthController.logoutAll);

module.exports = router;
