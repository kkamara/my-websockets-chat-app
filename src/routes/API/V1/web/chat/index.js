"use strict";
const router = require('express').Router();

router.use("/", require('./chatRoutes'));
router.use("/list", require('./list/index'));

module.exports = router;