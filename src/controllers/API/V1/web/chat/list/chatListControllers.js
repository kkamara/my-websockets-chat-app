"use strict";
const db = require("../../../../../../models/V1/index");
const { status, } = require("http-status");
const asyncHandler = require("express-async-handler");

const getChatList = asyncHandler(async (req, res) => {
  const chatList = await db.sequelize.models
    .chat
    .getChatList(req.session.userID);
  if (false === chatList) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error("Failed to get chat list");
  }
  return res.json({ data: chatList, });
});

module.exports = { getChatList, };