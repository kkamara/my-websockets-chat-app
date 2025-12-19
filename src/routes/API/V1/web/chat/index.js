"use strict";
const router = require('express').Router();

router.use("/", require('./chatRoutes'));

module.exports = router;