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

// To maintain configuration
require('dotenv').config();
// Middleware
const express = require("express");
// For CORS enabling
const cors = require("cors");
// pa11y - Accessibility api
const pa11y = require("pa11y");


// App instance
const app = express();
app.use(cors());

// Server Routes

// Result page (Guest user)
app.get("/api/v1/:url", async (req, res) => {

    // URL provided by the guest user
    const url = req.params.url;
    console.log(`URL ${url}`);
    // Options to use with pa11y
    const options = {
        includeErrors: false,
        includeWarning: false
    }
    try {
        console.log("pa11y analysing the webpage");
        // Pass the url and options to the pa11y api
        const result = await pa11y(url, options);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: "Cannot Evaluate the given page" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is up and listening on port ${PORT}`);
});
