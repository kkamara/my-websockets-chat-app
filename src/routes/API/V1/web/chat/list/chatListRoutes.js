"use strict";
const express = require("express");
const { getChatList, } = require("../../../../../../controllers/API/V1/web/chat/list/chatListControllers");
const { authenticate, } = require("../../../../../../middlewares/v1/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getChatList);

module.exports = router;