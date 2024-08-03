/**
 * 
 *  forgotPassword.js
 *  
 *  API for user password reset
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
import sendEmail from "../utils/sendEmail.js";
import emailInfo from "../utils/emailInfo.js";
import validator from "validator";


/**
 *  Reset password request
 */
router.post("/", async (req, res) => {
    try {
        // Destrcuture email from the request
        const { email } = req.body;

        if (email && !validator.isEmail(email)) {
            return res.status(401).json(
                {
                    success: false,
                    message: "Enter your registered email to proceed"
                });
        }

        // Check if user exists before sending the reset link
        const userQuery = `SELECT * 
                            FROM users 
                            WHERE email = $1`;
        const user = await db.query(userQuery, [email]);
        if (user.rows.length === 0) {
            return res.status(401).json(
                {
                    success: false,
                    message: "Email is not registered with a11yAssessor check the entered email!"
                });
        }

        // Generate Json web token
        const token = generateJWT(user.rows[0].user_id, "1h");

        // Send the password reset email
        const url = `${process.env.CLIENT_BASE_URL}/resetPassword/${user.rows[0].user_id}/${token}`;
        const name = user.rows[0].first_name.concat(" ", user.rows[0].last_name);
        await sendEmail(user.rows[0].email,
            emailInfo.passwordResetSubject,
            emailInfo.passwordResetMessage(name, url));

        res.status(200).json({
            "success": true,
            "message": "Password reset email sent",
            "token": token,
            "id": user.rows[0].user_id
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ "success": false, message: "Server Error" });
    }
});

/**
 *  Update the new password
 * 
 */
router.post("/:id/:token", async (req, res) => {

    try {
        // Destrcuture id and token from the params
        const id = req.params.id;
        const token = req.params.token;

        // Destructure the password and confirm password from the request
        const { password, confirmPassword } = req.body;

        // If params are missing return
        if (!token || !id) {
            return res.status(401).json({ message: "Invalid Link" });
        }

        // Check if password and confirm password matches
        if (password !== confirmPassword) {
            return res.status(401).json({ success: false, message: "Password Mismatch!" });
        }

        // Check if user exits or not and then verify the token
        const userQuery = `SELECT * 
                            FROM users
                            WHERE user_id = $1`;
        const user = await pool.query(userQuery, [id]);
        // Verify the token
        const verify = jwt.verify(token, process.env.SECRET_KEY);

        // Verify the user-id match to update the user status in database
        if (user.rows[0].user_id === verify.user.id) {
            // Encrypt the password before storing in the database using Bcrypt
            const salt = await bcrypt.genSalt(10);
            const hasedPassword = await bcrypt.hash(password, salt);

            // Update query
            const updateQuery = `UPDATE users 
                                SET password=$1, verified=TRUE 
                                WHERE user_id=$2`;
            // Update user info in the database
            await db.query(updateQuery, [hasedPassword, user.rows[0].user_id]);

            // Send response to the front-end
            res.json({ success: true, message: "Password reset successfully!" });
        } else {
            return res.json({ success: false, message: "Invalid Link" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});


export default router;