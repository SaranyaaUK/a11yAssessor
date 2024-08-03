/**
 *  server.js
 *  
 *  This is entry point for backend. Responsible for
 *  creating, intialising the express app, starting, 
 *  and listening on a given port.
 * 
 */

/**
 * Imports
 * 
 */

// To get the configuration
import dotenv from "dotenv";
dotenv.config()
// Middleware
import express from "express";
import passport from "./config/passportConfig.js";
// For CORS enabling
import cors from "cors";
// Routes
import authentication from "./routes/authentication.js";
import forgotPassword from "./routes/forgotPassword.js";
import guestResult from "./routes/guestResults.js";
import siteInfo from "./routes/sites.js";

// App instance
const app = express();
// To allow fetching from server
app.use(cors());
app.use(express.json());

/**
 * 
 * Server Routes
 * 
 * */

// User authentication routes
app.use("/api/v1/auth", authentication);

// User password reset routes
app.use("/api/v1/resetpassword", forgotPassword);

// Site Route
app.use("/api/v1/site", passport.authenticate('jwt', { session: false }), siteInfo);

// Guest user result page route
app.use("/api/v1", guestResult);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is up and listening on port ${PORT}`);
});
