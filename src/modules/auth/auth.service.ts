import bcrypt from "bcryptjs";
import { pool } from "../../db";
import  jwt  from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async(payload: {email: string; password: string})=> {
    const {email, password} = payload;
    const user = await pool.query(
        `
        SELECT * FROm users WHERE email=$1
        `,
        [email]
    )
    if(user.rowCount === 0) {
        throw new Error("Invalid Credentials !!")
    }
    const matchPassword = await bcrypt.compare(password, user.rows[0].password)
    if(!matchPassword) {
        throw new Error("Invalid Credentials !!")
    }
    if(!user.rows[0].is_Active) {
        throw new Error("Access Denied !!")
    }

    const JwtPayload = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
    }

    const accessToken = jwt.sign(JwtPayload, config.jwt_secret, {
        expiresIn : "1d"
    });
    return {
        accessToken,
        user: {
            id: user.rows[0].id,
            name: user.rows[0].name,
            email: user.rows[0].email,
        }
    };
}

export const authService = {
    loginUserIntoDB
}