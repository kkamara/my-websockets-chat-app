"use strict";
const { authenticate } = require('../../../../../middlewares/V1/authMiddleware');
const { getMessages } = require('../../../../../controllers/API/V1/web/chat/messagesControllers');
const router = require('express').Router({ mergeParams: true });

router.get("/", authenticate, getMessages);

module.exports = router;