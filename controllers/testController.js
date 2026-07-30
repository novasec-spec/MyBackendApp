const db =
require("../database/DatabaseService");

exports.test = (req, res) => {

    const users =
    db.findAll("SELECT * FROM users");

    res.json(users);

};
