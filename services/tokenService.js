const jwt =
require("jsonwebtoken");

function createAccessToken(user){

    return jwt.sign(

        {

            id:user.id,

            username:user.username,

            email:user.email

        },

        process.env.JWT_SECRET,

        {

            expiresIn:
            process.env.ACCESS_TOKEN_EXPIRES

        }

    );

}

function createRefreshToken(user){

    return jwt.sign(

        {

            id:user.id

        },

        process.env.JWT_REFRESH_SECRET,

        {

            expiresIn:
            process.env.REFRESH_TOKEN_EXPIRES

        }

    );

}

module.exports={

createAccessToken,

createRefreshToken

};
