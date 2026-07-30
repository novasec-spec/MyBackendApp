const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { query } = require('../config/database');

class TokenService {
  static generateAccessToken(userId, email) {
    return jwt.sign(
      { id: userId, email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
    );
  }

  static generateRefreshToken(userId, email) {
    return jwt.sign(
      { id: userId, email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
    );
  }

  static hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static async storeRefreshToken(userId, refreshToken, deviceInfo, ipAddress) {
    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const result = await query(
      `INSERT INTO sessions (user_id, refresh_token_hash, device_info, ip_address, expires_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [userId, tokenHash, deviceInfo, ipAddress, expiresAt]
    );
    return result.rows[0];
  }

  static async findRefreshToken(userId, refreshToken) {
    const tokenHash = this.hashToken(refreshToken);
    const result = await query(
      `SELECT id, user_id, expires_at, revoked_at
       FROM sessions 
       WHERE user_id = $1 AND refresh_token_hash = $2 AND revoked_at IS NULL`,
      [userId, tokenHash]
    );
    return result.rows[0] || null;
  }

  static async revokeAllUserSessions(userId) {
    await query(
      `UPDATE sessions 
       SET revoked_at = CURRENT_TIMESTAMP 
       WHERE user_id = $1 AND revoked_at IS NULL`,
      [userId]
    );
  }

  static async revokeSession(sessionId) {
    await query(
      `UPDATE sessions 
       SET revoked_at = CURRENT_TIMESTAMP 
       WHERE id = $1`,
      [sessionId]
    );
  }

  static verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  }
}

module.exports = { TokenService };
