const bcryptjs = require("bcryptjs");

const rounds =
parseInt(process.env.BCRYPT_ROUNDS || 12);

async function hash(password){

    return await bcryptjs.hash(password, rounds);

}

async function verify(password, hash){

    return await bcryptjs.compare(password, hash);

}

module.exports = {

    hash,
    verify

};
