const pool = require("../config/database");

class DatabaseService {

    async query(sql, params = []) {

        const result = await pool.query(sql, params);

        return result.rows;

    }

    async execute(sql, params = []) {

        await pool.query(sql, params);

    }

    async findOne(sql, params = []) {

        const result = await pool.query(sql, params);

        return result.rows.length ? result.rows[0] : null;

    }

    async findAll(sql, params = []) {

        const result = await pool.query(sql, params);

        return result.rows;

    }

}

module.exports = new DatabaseService();
