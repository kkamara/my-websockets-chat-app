"use strict";
const express = require("express");
const { searchUsersList } = require("../../../../../controllers/API/V1/web/users/usersListControllers");
const { authenticate } = require("../../../../../middlewares/V1/authMiddleware");

const router = express.Router();

router.get("/", authenticate, searchUsersList);

module.exports = router;