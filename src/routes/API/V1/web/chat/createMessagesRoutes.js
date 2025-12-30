"use strict";
const { createMessage } = require('../../../../../controllers/API/V1/web/chat/messagesControllers');
const { authenticate } = require('../../../../../middlewares/V1/authMiddleware');
const router = require('express').Router({ mergeParams: true });

router.post("/", authenticate, createMessage);

module.exports = router;