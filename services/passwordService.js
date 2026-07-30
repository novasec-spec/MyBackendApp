const bcryptjs = require("bcrypt");

const rounds =
parseInt(process.env.BCRYPT_ROUNDS || 12);

async function hash(password){

    return await bcrypt.hash(password, rounds);

}

async function verify(password, hash){

    return await bcrypt.compare(password, hash);

}

module.exports = {

    hash,
    verify

};
