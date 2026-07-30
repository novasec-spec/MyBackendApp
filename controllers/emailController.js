const { AuthService } = require('../services/authService');
const { AppResponse } = require('../utils/response');

class EmailController {
  static async requestVerification(req, res, next) {
    try {
      await AuthService.requestEmailVerification(req.user.id);
      return AppResponse.success(res, 'Verification email sent');
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req, res, next) {
    try {
      const { token } = req.body;
      await AuthService.verifyEmail(token);
      return AppResponse.success(res, 'Email verified successfully');
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);
      return AppResponse.success(res, result.message);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      const result = await AuthService.resetPassword(token, newPassword);
      return AppResponse.success(res, result.message);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { EmailController };
