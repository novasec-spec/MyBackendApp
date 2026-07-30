const db = require("../database/DatabaseService");
const passwordService = require("./passwordService");
const tokenService = require("./tokenService");

const crypto = require("crypto");
const { v4: uuid } = require("uuid");

class AuthService {

    async register(data, req) {

        const username =
            data.username.trim();

        const email =
            data.email.trim().toLowerCase();

        const password =
            data.password;

        const existingUser =
             await  db.findOne(
"SELECT * FROM users WHERE email=$1 OR username=$2",               
                [email, username]
            );

        if (existingUser) {

            throw new Error(
                "Email or username already exists."
            );

        }

        const hash =
            await passwordService.hash(password);

        const user = {

            id: uuid(),

            username,

            email,

            password_hash: hash,

            created_at:
                new Date().toISOString(),

            updated_at:
                new Date().toISOString()

        };

        await db.execute(

            `INSERT INTO users
            (
                id,
                username,
                email,
                password_hash,
                created_at,
                updated_at
            )
            VALUES ($1,$2,$3,$4,$5,$6)`,

            [

                user.id,

                user.username,

                user.email,

                user.password_hash,

                user.created_at,

                user.updated_at

            ]

        );

        return await this.login(
            email,
            password,
            req
        );

    }

    async login(email, password, req) {

        const user =
           await db.findOne(
                 "SELECT * FROM users WHERE email=$1",

                [email.toLowerCase()]

            );

        if (!user) {

            throw new Error(
                "Invalid email or password."
            );

        }

        const ok =
            await passwordService.verify(

                password,

                user.password_hash

            );

        if (!ok) {

            throw new Error(
                "Invalid email or password."
            );

        }

        const accessToken =
            tokenService.createAccessToken(user);

        const refreshToken =
            tokenService.createRefreshToken(user);

        const refreshHash =
            crypto
                .createHash("sha256")
                .update(refreshToken)
                .digest("hex");

       await db.execute(

            `INSERT INTO sessions
            (
                id,
                user_id,
                refresh_token_hash,
                device_name,
                ip_address,
                created_at,
                expires_at
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7)`,

            [

                uuid(),

                user.id,

                refreshHash,

                req.headers["user-agent"],

                req.ip,

                new Date().toISOString(),

                new Date(
                    Date.now() +
                    30 * 24 * 60 * 60 * 1000
                ).toISOString()

            ]

        );

        return {

            accessToken,

            refreshToken,

            user:{

                id:user.id,

                username:user.username,

                email:user.email

            }

        };

    }

}

module.exports =
new AuthService();
