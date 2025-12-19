'use strict';
const express = require('express');
const usersRoutes = require("./usersRoutes");
const userRoutes = require("./userRoutes");
const chatRoutes = require("./chat/index");

const router = express.Router();

router.use("/users", usersRoutes);
router.use("/user", userRoutes);
router.use("/chat", chatRoutes);

module.exports = router;