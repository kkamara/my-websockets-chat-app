"use strict";
const express = require("express");

const router = express.Router();

router.use("/", require("./usersList"));

module.exports = router;