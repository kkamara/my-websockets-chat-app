"use strict";
const express = require('express');
const { createChat } = require('../../../../../controllers/API/V1/web/chat/chatControllers');
const { authenticate } = require('../../../../../middlewares/V1/authMiddleware');

const router = express.Router();

router.post("/", authenticate, createChat);

module.exports = router;