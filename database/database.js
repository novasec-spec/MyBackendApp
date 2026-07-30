const fs = require("fs");
const initSqlJs = require("sql.js");

let db;

async function initializeDatabase() {

    const SQL = await initSqlJs();

    if (fs.existsSync("./database/app.db")) {

        const fileBuffer =
            fs.readFileSync("./database/app.db");

        db = new SQL.Database(fileBuffer);

    } else {

        db = new SQL.Database();

    }

    const schema =
        fs.readFileSync(
            "./database/schema.sql",
            "utf8"
        );

    db.run(schema);

    saveDatabase();

    console.log("Database initialized");

}

function saveDatabase() {

    const data = db.export();

    fs.writeFileSync(
        "./database/app.db",
        Buffer.from(data)
    );

}

function getDatabase() {

    return db;

}

module.exports = {

    initializeDatabase,

    saveDatabase,

    getDatabase

};
