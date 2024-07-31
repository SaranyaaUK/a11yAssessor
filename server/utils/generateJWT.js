/**
 * 
 * generateJWT.js
 * 
 * Utility to generate Json Web Token for registered user
 * 
 */
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

function generateJWT(user_id, duration) {
    // Use a payload with user's unique id to generate the JWT
    const payload = {
        user: {
            id: user_id
        }
    };

    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: duration });
}

export default generateJWT;