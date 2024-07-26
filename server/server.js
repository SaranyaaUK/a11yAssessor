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
// For CORS enabling
import cors from "cors";
// Routes
import guestResult from "./routes/guestResults.js"


// App instance
const app = express();
// To allow fetching from server
app.use(cors());
app.use(express.json());

// Server Routes

// Guest user result page routes
app.use("/api/v1", guestResult);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is up and listening on port ${PORT}`);
});
