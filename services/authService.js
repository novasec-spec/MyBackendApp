const { UserModel } = require('../models/userModel');
const { PasswordService } = require('./passwordService');
const { TokenService } = require('./tokenService');
const { EmailService } = require('./emailService'); 
const { AppError } = require('../middleware/errorHandler');

class AuthService {
  static async register(userData) {
    const { email, password, firstName, lastName } = userData;

    // Check if user exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Hash password
    const passwordHash = await PasswordService.hash(password);

    // Create user
    const user = await UserModel.create({
      email,
      passwordHash,
      firstName,
      lastName
    });

    return user;
  }

  static async login(email, password, deviceInfo, ipAddress) {
    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.is_active) {
      throw new AppError('Account is disabled', 401);
    }

    // Verify password
    const isValidPassword = await PasswordService.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const accessToken = TokenService.generateAccessToken(user.id, user.email);
    const refreshToken = TokenService.generateRefreshToken(user.id, user.email);

    // Store refresh token
    await TokenService.storeRefreshToken(
      user.id,
      refreshToken,
      deviceInfo || 'Unknown',
      ipAddress || 'Unknown'
    );

    // Update last login
    await UserModel.update(user.id, { lastLogin: new Date() });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isEmailVerified: user.is_email_verified
      },
      accessToken,
      refreshToken
    };
  }

  static async refreshTokens(userId, refreshToken) {
    // Verify refresh token
    const decoded = TokenService.verifyRefreshToken(refreshToken);
    if (decoded.id !== userId) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Find stored token
    const storedToken = await TokenService.findRefreshToken(userId, refreshToken);
    if (!storedToken) {
      throw new AppError('Refresh token not found', 401);
    }

    // Check if expired
    if (new Date(storedToken.expires_at) < new Date()) {
      throw new AppError('Refresh token expired', 401);
    }

    // Get user
    const user = await UserModel.findById(userId);
    if (!user || !user.is_active) {
      throw new AppError('User not found or inactive', 401);
    }

    // Generate new tokens
    const newAccessToken = TokenService.generateAccessToken(user.id, user.email);
    const newRefreshToken = TokenService.generateRefreshToken(user.id, user.email);

    // Revoke old refresh token
    await TokenService.revokeSession(storedToken.id);

    // Store new refresh token
    // Note: In a real app, you'd need to get device info and IP from the request
    // We'll pass these from the controller
    await TokenService.storeRefreshToken(user.id, newRefreshToken, 'Unknown', 'Unknown');

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

// Add to AuthService class
static async requestEmailVerification(userId) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.is_email_verified) {
    throw new AppError('Email already verified', 400);
  }

  const token = await EmailService.createVerificationToken(userId);
  await EmailService.sendVerificationEmail(user.email, user.first_name, token);
  
  return { message: 'Verification email sent' };
}

static async verifyEmail(token) {
  const userId = await EmailService.verifyEmail(token);
  return { userId, message: 'Email verified successfully' };
}

static async forgotPassword(email) {
  const user = await UserModel.findByEmail(email);
  if (!user) {
    // Don't reveal if email exists or not for security
    return { message: 'If an account exists, a reset link will be sent' };
  }

  const token = await EmailService.createPasswordResetToken(user.id);
  await EmailService.sendPasswordResetEmail(user.email, user.first_name, token);
  
  return { message: 'If an account exists, a reset link will be sent' };
}

static async resetPassword(token, newPassword) {
  const userId = await EmailService.verifyPasswordResetToken(token);
  
  const hashedPassword = await PasswordService.hash(newPassword);
  await UserModel.update(userId, { passwordHash: hashedPassword });
  
  await EmailService.usePasswordResetToken(token);
  
  // Revoke all sessions for security
  await TokenService.revokeAllUserSessions(userId);
  
  return { message: 'Password reset successfully' };
}


  static async logout(userId, refreshToken) {
    const storedToken = await TokenService.findRefreshToken(userId, refreshToken);
    if (storedToken) {
      await TokenService.revokeSession(storedToken.id);
    }
  }

  static async logoutAll(userId) {
    await TokenService.revokeAllUserSessions(userId);
  }
}

module.exports = { AuthService };
