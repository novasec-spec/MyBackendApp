const {
    getDatabase,
    saveDatabase
} = require("./database");

class DatabaseService {

    query(sql, params = []) {

        const db = getDatabase();

        const stmt = db.prepare(sql);

        stmt.bind(params);

        const rows = [];

        while (stmt.step()) {

            rows.push(stmt.getAsObject());

        }

        stmt.free();

        return rows;

    }

    execute(sql, params = []) {

        const db = getDatabase();

        db.run(sql, params);

        saveDatabase();

    }

    findOne(sql, params = []) {

        const rows = this.query(sql, params);

        return rows.length ? rows[0] : null;

    }

    findAll(sql, params = []) {

        return this.query(sql, params);

    }

}

module.exports = new DatabaseService();
