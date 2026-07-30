const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { query } = require('../config/database');
const { logger } = require('../utils/logger');

class EmailService {
  static createTransporter() {
    // Configure your email provider (SendGrid, Mailgun, SMTP, etc.)
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  static generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  static hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static async createVerificationToken(userId) {
    const token = this.generateToken();
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

    // Remove any existing verification tokens for this user
    await query(
      'DELETE FROM email_verifications WHERE user_id = $1 AND used_at IS NULL',
      [userId]
    );

    await query(
      `INSERT INTO email_verifications (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, tokenHash, expiresAt]
    );

    return token;
  }

  static async verifyEmail(token) {
    const tokenHash = this.hashToken(token);
    
    const result = await query(
      `SELECT user_id, expires_at, used_at 
       FROM email_verifications 
       WHERE token_hash = $1`,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid verification token');
    }

    const verification = result.rows[0];

    if (verification.used_at) {
      throw new Error('Token already used');
    }

    if (new Date(verification.expires_at) < new Date()) {
      throw new Error('Token expired');
    }

    // Mark token as used
    await query(
      'UPDATE email_verifications SET used_at = CURRENT_TIMESTAMP WHERE token_hash = $1',
      [tokenHash]
    );

    // Verify user's email
    await query(
      'UPDATE users SET is_email_verified = true WHERE id = $1',
      [verification.user_id]
    );

    return verification.user_id;
  }

  static async sendVerificationEmail(email, firstName, token) {
    const transporter = this.createTransporter();
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@yourapp.com',
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome ${firstName || 'User'}!</h2>
          <p>Thank you for registering. Please click the button below to verify your email address:</p>
          <a href="${verificationLink}" 
             style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; 
                    color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Verify Email
          </a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationLink}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
          <hr>
          <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info(`Verification email sent to ${email}`);
    } catch (error) {
      logger.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  static async sendPasswordResetEmail(email, firstName, token) {
    const transporter = this.createTransporter();
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@yourapp.com',
      to: email,
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>Hi ${firstName || 'User'},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${resetLink}" 
             style="display: inline-block; padding: 12px 24px; background-color: #FF9800; 
                    color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Reset Password
          </a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetLink}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr>
          <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info(`Password reset email sent to ${email}`);
    } catch (error) {
      logger.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  static async createPasswordResetToken(userId) {
    const token = this.generateToken();
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    // Remove any existing reset tokens for this user
    await query(
      'DELETE FROM password_resets WHERE user_id = $1 AND used_at IS NULL',
      [userId]
    );

    await query(
      `INSERT INTO password_resets (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, tokenHash, expiresAt]
    );

    return token;
  }

  static async verifyPasswordResetToken(token) {
    const tokenHash = this.hashToken(token);
    
    const result = await query(
      `SELECT user_id, expires_at, used_at 
       FROM password_resets 
       WHERE token_hash = $1`,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid reset token');
    }

    const reset = result.rows[0];

    if (reset.used_at) {
      throw new Error('Token already used');
    }

    if (new Date(reset.expires_at) < new Date()) {
      throw new Error('Token expired');
    }

    return reset.user_id;
  }

  static async usePasswordResetToken(token) {
    const tokenHash = this.hashToken(token);
    await query(
      'UPDATE password_resets SET used_at = CURRENT_TIMESTAMP WHERE token_hash = $1',
      [tokenHash]
    );
  }
}

module.exports = { EmailService };
