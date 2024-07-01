/**
 *  server.js
 *  
 *  This is entry point for backend. Responsible for
 *  creating, intialising the express app, starting, 
 *  and listening on a given port.
 * 
 */

// Import Dependency

// To maintain configuration
require('dotenv').config();
const express = require("express");

// App instance
const app = express();

// Test an enpoint
app.get("/", (req, res) => {
    console.log("Home Page");
    res.send("Home page end point is working");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is up and listening on port ${PORT}`);
});
