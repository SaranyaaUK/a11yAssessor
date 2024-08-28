/**
 * 
 * passportConfig.js
 * 
 * Passport Json Web Token (JWT) authentication configuration
 * 
 */

import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import db from "./databaseConfig.js"
import passport from "passport";
import passportJWT from "passport-jwt";
import passportLocal from "passport-local";

// Passport authentication strategy
const jwtStrategy = passportJWT.Strategy;
const jwtExtract = passportJWT.ExtractJwt;


// Local Strategy to authenticate user
const authenticateUser = (email, password, done) => {

    const userQueryText = `SELECT * FROM users WHERE email=$1`;

    db.query(
        userQueryText,
        [email],
        (err, results) => {
            if (err) {
                // Throw the error if there is some issue
                throw err;
            } else {
                // If the query is successful
                if (results.rows.length > 0) {
                    const user = results.rows[0];
                    // Use bcrypt to validate the password to authenticate the user
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            throw err;
                        }
                        if (isMatch) {
                            // Check if user account is verified
                            if (!user.verified) {
                                return done(null, false,
                                    { message: "Email not verified yet, please verify your email before logging in!" });
                            } else {
                                return done(null, user);
                            }
                        } else {
                            return done(null, false, { message: "Password mismatch" });
                        }
                    });
                } else {
                    return done(null, false, { message: "Password or email is incorrect!" });
                }
            }
        }
    )
}

passport.use(new passportLocal({
    usernameField: 'email',
    passwordField: 'password',
}, authenticateUser));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
    const userQueryText = `SELECT * FROM users WHERE id=$1`;
    db.query(
        userQueryText,
        [id],
        (err, results) => {
            if (err) {
                throw err;
            }
            return done(null, results.rows[0])
        }
    )
});

// JWT Strategy to authorise the user
const jwtOptions = {
    jwtFromRequest: jwtExtract.fromHeader('token'),
    secretOrKey: process.env.SECRET_KEY
};

passport.use(new jwtStrategy(jwtOptions, (payload, done) => {

    const userQueryText = `SELECT * FROM users WHERE user_id=$1`;
    db.query(
        userQueryText,
        [payload.user.id],
        (err, results) => {
            if (err) {
                // Throw the error if there is some issue
                return done(err, false, { message: "User is not authorised" });
            } else {
                // If the query is successful
                const user = results.rows[0];

                if (results.rows.length > 0 && user.verified) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "User is not authorised" });
                }
            }
        }
    )
}));

export default passport;