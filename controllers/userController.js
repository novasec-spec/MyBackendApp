const { UserModel } = require('../models/userModel');
const { AppResponse } = require('../utils/response');
const { AppError } = require('../middleware/errorHandler');
const { PasswordService } = require('../services/passwordService');

class UserController {
  static async getMe(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      return AppResponse.success(res, 'User retrieved', { user });
    } catch (error) {
      next(error);
    }
  }

  static async updateMe(req, res, next) {
    try {
      const { firstName, lastName, currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const updates = {};
      if (firstName) updates.firstName = firstName;
      if (lastName) updates.lastName = lastName;

      // Handle password change
      if (newPassword) {
        if (!currentPassword) {
          throw new AppError('Current password required to change password', 400);
        }

        const user = await UserModel.findById(userId);
        const isValidPassword = await PasswordService.compare(
          currentPassword,
          user.password_hash
        );

        if (!isValidPassword) {
          throw new AppError('Current password is incorrect', 401);
        }

        updates.passwordHash = await PasswordService.hash(newPassword);
      }

      if (Object.keys(updates).length === 0) {
        throw new AppError('No updates provided', 400);
      }

      const updatedUser = await UserModel.update(userId, updates);
      if (!updatedUser) {
        throw new AppError('User not found', 404);
      }

      return AppResponse.success(res, 'User updated', { user: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  static async deleteMe(req, res, next) {
    try {
      const userId = req.user.id;
      const { password } = req.body;

      // Verify password before deletion
      const user = await UserModel.findById(userId);
      const isValidPassword = await PasswordService.compare(password, user.password_hash);

      if (!isValidPassword) {
        throw new AppError('Invalid password', 401);
      }

      const deleted = await UserModel.delete(userId);
      if (!deleted) {
        throw new AppError('User not found', 404);
      }

      return AppResponse.success(res, 'Account deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { UserController };
