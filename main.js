"use strict"

// Require all packages and other files
const express = require("express");
const layouts = require("express-ejs-layouts");
const router = require ("./routes/router");

// Set app port number and to use express
const port = 3000;
const app = express();

app.set("view engine", "ejs");
app.use(layouts);
app.use(express.static("static"));
app.use(express.urlencoded());

// Routes
app.use('/', router);

//set the app listen to the port and create the server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

