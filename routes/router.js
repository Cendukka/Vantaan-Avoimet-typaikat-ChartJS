"use strict"

const express = require('express');
const router = express.Router();
//require controllers
const mainController = require("../controllers/mainController");

router.get("/", mainController.showMainPage);

module.exports = router;