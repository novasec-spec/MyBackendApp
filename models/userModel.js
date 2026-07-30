const { query } = require('../config/database');

class UserModel {
  static async create(userData) {
    const { email, passwordHash, firstName, lastName } = userData;
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, first_name, last_name, is_email_verified, is_active, created_at`,
      [email, passwordHash, firstName, lastName]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await query(
      `SELECT id, email, password_hash, first_name, last_name, 
              is_email_verified, is_active, last_login, created_at
       FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0] || null;
  }

  static async findById(id) {
    const result = await query(
      `SELECT id, email, first_name, last_name, 
              is_email_verified, is_active, last_login, created_at, updated_at
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCounter = 1;

    if (updates.firstName !== undefined) {
      fields.push(`first_name = $${paramCounter++}`);
      values.push(updates.firstName);
    }
    if (updates.lastName !== undefined) {
      fields.push(`last_name = $${paramCounter++}`);
      values.push(updates.lastName);
    }
    if (updates.passwordHash !== undefined) {
      fields.push(`password_hash = $${paramCounter++}`);
      values.push(updates.passwordHash);
    }
    if (updates.isActive !== undefined) {
      fields.push(`is_active = $${paramCounter++}`);
      values.push(updates.isActive);
    }
    if (updates.lastLogin !== undefined) {
      fields.push(`last_login = $${paramCounter++}`);
      values.push(updates.lastLogin);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const queryText = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING id, email, first_name, last_name, is_email_verified, is_active, created_at, updated_at
    `;

    const result = await query(queryText, values);
    return result.rows[0] || null;
  }

  static async delete(id) {
    const result = await query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0] || null;
  }
}

module.exports = { UserModel };
