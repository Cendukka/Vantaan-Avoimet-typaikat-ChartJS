/**
 * Router file to handle all incoming REST requests through router middleware
 *  -> redirects them to appropriate controller to handle the actions
 */
"use strict"

const express = require('express');
const router = express.Router();
//require controllers
const mainController = require("../controllers/mainController");

router.get("/", mainController.renderMainPage);

module.exports = router;