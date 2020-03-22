"use strict"

/**
 * The main javascript file for node.js that creates the server for the application 
 */

// Require all packages and other files
const express = require("express");
const layouts = require("express-ejs-layouts");
const router = require ("./routes/router");

// Set app port number and to use express
const port = 3000;
const app = express();
// Set the app use EJS (Embedded JavaScript templates) layout
app.set("view engine", "ejs");
app.use(layouts);
//the app to serve static files
app.use(express.static("static"));

// Routes
app.use('/', router);

//set the app listen to the port and create the server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

