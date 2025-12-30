"use strict";
const router = require('express').Router();

router.use("/", require('./chatRoutes'));
router.use("/list", require('./list/index'));
router.use("/:chatID", require('./getMessagesRoutes'));

module.exports = router;