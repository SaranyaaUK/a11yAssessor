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
import automated from "./routes/automatedResults.js";
import forgotPassword from "./routes/forgotPassword.js";
import guestResult from "./routes/guestResults.js";
import manual from "./routes/manualEvaluation.js";
import siteInfo from "./routes/sites.js";

// App instance
const app = express();
// To allow fetching from server
const corsOption = {
    origin: process.env.CLIENT_BASE_URL,
    method: ["POST", "GET", "DELETE"],
    credentials: true
}
app.use(cors(corsOption));
app.use(express.json());

/**
 * 
 * Server Routes
 * 
 * */

// User authentication Routes
app.use("/api/v1/auth", authentication);

/**
 *  Authorised Routes
 */
// User password reset Routes
app.use("/api/v1/resetpassword", forgotPassword);

// Site Routes
app.use("/api/v1/site", passport.authenticate('jwt', { session: false }), siteInfo);

// Automated Evaluation Routes
app.use("/api/v1/automated", passport.authenticate('jwt', { session: false }), automated);

// Manual Evaluation Routes
app.use("/api/v1/manual", passport.authenticate('jwt', { session: false }), manual);

/**
 *  Unauthorised Routes
 */
// Guest user result page Routes
app.use("/api/v1", guestResult);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is up and listening on port ${PORT}`);
});
