const { AuthService } = require('../services/authService');
const { AppResponse } = require('../utils/response');
const { logger } = require('../utils/logger');

class AuthController {
  static async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body;
      const user = await AuthService.register({
        email,
        password,
        firstName,
        lastName
      });
      
      logger.info(`User registered: ${email}`);
      return AppResponse.created(res, 'Registration successful', {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const deviceInfo = req.headers['user-agent'] || 'Unknown';
      const ipAddress = req.ip || req.connection.remoteAddress;

      const result = await AuthService.login(
        email,
        password,
        deviceInfo,
        ipAddress
      );

      logger.info(`User logged in: ${email}`);
      return AppResponse.success(res, 'Login successful', result);
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const { id: userId } = req.user || {};

      if (!userId) {
        return AppResponse.unauthorized(res, 'User ID required');
      }

      const result = await AuthService.refreshTokens(userId, refreshToken);
      return AppResponse.success(res, 'Tokens refreshed', result);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const userId = req.user.id;

      await AuthService.logout(userId, refreshToken);
      logger.info(`User logged out: ${userId}`);
      return AppResponse.success(res, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  static async logoutAll(req, res, next) {
    try {
      const userId = req.user.id;
      await AuthService.logoutAll(userId);
      logger.info(`All sessions terminated for user: ${userId}`);
      return AppResponse.success(res, 'All sessions terminated');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { AuthController };
