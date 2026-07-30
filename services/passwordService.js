const bcryptjs = require('bcryptjs');

class PasswordService {
  static async hash(password) {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    return await bcryptjs.hash(password, saltRounds);
  }

  static async compare(password, hash) {
    return await bcryptjs.compare(password, hash);
  }
}

module.exports = { PasswordService };
