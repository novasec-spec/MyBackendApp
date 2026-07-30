const { query } = require('../config/database');
const { logger } = require('./logger');
const fs = require('fs');
const path = require('path');

class Migration {
  static async createMigrationsTable() {
    await query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  static async getExecutedMigrations() {
    const result = await query('SELECT name FROM migrations ORDER BY id');
    return result.rows.map(row => row.name);
  }

  static async executeMigration(filePath) {
    const sql = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    try {
      await query(sql);
      await query('INSERT INTO migrations (name) VALUES ($1)', [fileName]);
      logger.info(`Migration executed: ${fileName}`);
    } catch (error) {
      logger.error(`Failed to execute migration ${fileName}:`, error);
      throw error;
    }
  }

  static async runMigrations() {
    await this.createMigrationsTable();
    
    const migrationsDir = path.join(__dirname, '../migrations');
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir);
      return;
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    const executed = await this.getExecutedMigrations();
    const pending = files.filter(f => !executed.includes(f));

    if (pending.length === 0) {
      logger.info('No pending migrations');
      return;
    }

    logger.info(`Running ${pending.length} migrations...`);
    
    for (const file of pending) {
      await this.executeMigration(path.join(migrationsDir, file));
    }
    
    logger.info('Migrations completed successfully');
  }
}

module.exports = { Migration };
