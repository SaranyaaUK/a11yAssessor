/**
 * 
 *  authentication.js
 *  
 *  API for user authentication
 * 
 */

import bcrypt from "bcrypt";
import db from "../config/databaseConfig.js";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import generateJWT from "../utils/generateJWT.js";
import jwt from "jsonwebtoken";
const router = express.Router();
import passport from "../config/passportConfig.js";
import sendEmail from "../utils/sendEmail.js";
import emailInfo from "../utils/emailInfo.js";
import validator from "validator";

/**
 *  User Registration
 * 
 */
router.post("/register", async (req, res) => {

    try {
        // Get registration inputs from the client side
        const { firstname, lastname, email, password, confirmPassword } = req.body;

        /**
         * Validations 
         */

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(401).json({ success: false, message: "Invalid email" });
        }

        // Check if user exists in the database
        const checkUserExistQuery = `SELECT * 
                                    FROM users 
                                    WHERE email = $1`;
        const user = await db.query(checkUserExistQuery, [email]);

        if (user.rows.length > 0) {
            return res.status(401).json({ success: false, message: "User already exist!" });
        }

        // Check if password and confirm password matches
        if (password !== confirmPassword) {
            return res.status(401).json({ success: false, message: "Password Mismatch!" });
        }

        // Encrypt the password before storing in the database using Bcrypt
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(password, salt);

        // Add user data to the database
        const addUserQuery = `INSERT INTO users(first_name, last_name, email, password)
                              VALUES ($1,$2,$3,$4) 
                              RETURNING *`;
        let newUser = await db.query(addUserQuery, [firstname, lastname, email, hasedPassword]);

        // Generate Json web token
        const token = generateJWT(newUser.rows[0].user_id, "1d");

        // Send verification email to the user
        const url = `${process.env.CLIENT_BASE_URL}/activate/${newUser.rows[0].user_id}/${token}`;
        const name = newUser.rows[0].first_name.concat(" ", newUser.rows[0].last_name);
        await sendEmail(newUser.rows[0].email,
            emailInfo.emailVerificationSubject,
            emailInfo.emailVerificationMessage(name, url));

        // Send response to the front-end
        res.status(200).json({
            "success": true,
            "message": "Registration successful, please verify your email before login",
            "token": token
        });
    } catch (error) {
        // Send response to the front-end
        res.status(500).json({ success: false, message: "Server Error" });
    }

});

/**
 *  User Email verification
 * 
 */
router.get("/activate/:id/:token", async (req, res) => {

    try {
        // Get the params
        const id = req.params.id; // Unique User ID
        const token = req.params.token; // JWT

        if (!token || !id) {
            return res.status(401).json({ success: false, message: "Invalid Link" });
        }

        // Check if user exists in the database
        const checkUserExistQuery = `SELECT * 
                                    FROM users 
                                    WHERE user_id = $1`;
        const user = await db.query(checkUserExistQuery, [id]);
        // Verify the token
        const verify = jwt.verify(token, process.env.SECRET_KEY);

        // Verify the user-id match to update the user status in database
        if (user.rows[0].user_id === verify.user.id) {
            const updateVerifiedStatusQuery = `UPDATE users 
                                               SET verified = TRUE 
                                               WHERE user_id=$1`;
            await db.query(updateVerifiedStatusQuery, [id]);

            // Send response to the front-end
            res.status(200).json({ success: true, message: "Email verification successful" });
        } else {
            // Send response to the front-end
            res.json({ success: false, message: "Email verification failed, invalid link" });
        }
    }
    catch (error) {
        console.log(error.message);
        // Send response to the front-end
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

/**
 *  User Login
 * 
 */
router.post("/login",
    // authentication
    passport.authenticate('local', { session: false }),
    async (req, res) => {
        try {
            // Destrcuture user
            const { email } = req.user;

            const userQuery = `SELECT * 
                                    FROM users 
                                    WHERE email = $1`;
            const user = await db.query(userQuery, [email]);

            // Check if user account is verified if not allow login
            if (!user.rows[0].verified) {
                return res.status(401).json({ message: "Email not verified yet, please verify your email before logging in!" });
            }

            // Generate the JWT to send to the front end
            const token = generateJWT(user.rows[0].user_id, "1d");
            // Send response to the front-end
            res.json({ token });

        } catch (error) {
            console.log(error.message);
            // Send response to the front-end
            res.status(500).json({ message: "Server Error" });
        }
    }
);

/**
 * Authorise the user
 * 
 */
router.get("/verify",
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        try {
            // If user is authenticated their data 
            // will be available in the request
            // When requested send the information to the front-end
            if (req.user) {
                res.status(200).json(
                    {
                        success: true,
                        user: {
                            first_name: req.user.first_name,
                            last_name: req.user.last_name,
                            user_id: req.user.user_id
                        }
                    });
            } else {
                // Send response to the front-end
                res.json({ success: false, message: "Session expired, login again to continue" });
            }
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    }
);

export default router;