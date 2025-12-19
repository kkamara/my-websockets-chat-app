"use strict";
const asyncHandler = require("express-async-handler");
const db = require("../../../../../models/V1");
const { default: status } = require("http-status");
const { message400, message200 } = require("../../../../../utils/httpResponses");

const createChat = asyncHandler(async (req, res) => {
  const inputError = await db.sequelize.models.chat
    .getCreateChatError(req.body);
  if (false !== inputError) {
    res.status(status.BAD_REQUEST);
    throw new Error(inputError);
  }
  
  const cleanData = db.sequelize.models.chat
    .getCleanCreateChatData(req.bodyInt("userID"));
  if (false === cleanData) {
    res.status(status.BAD_REQUEST);
    throw new Error(message400);
  }
  
  const createChat = await db.sequelize.models.chat
    .createChat(
      [req.session.userID, cleanData.userID]
    );
  if (false === createChat) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error("Failed to create chat.");
  }

  return res.json({ message: message200 });
});

const createGroupChat = asyncHandler(async (req, res) => {
  const inputError = await db.sequelize.models.chat
    .getCreateGroupChatError(req.body);
  if (false !== inputError) {
    res.status(status.BAD_REQUEST);
    throw new Error(inputError);
  }
  
  const cleanData = db.sequelize.models.chat
    .getCleanCreateGroupChatData(
      req.body.chatName,
      req.body.userIDs,
    );
  if (false === cleanData) {
    res.status(status.BAD_REQUEST);
    throw new Error(message400);
  }
  
  const createChat = await db.sequelize.models.chat
    .createGroupChat(
      cleanData.chatName,
      [req.session.userID, ...cleanData.userIDs]
    );
  if (false === createChat) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error("Failed to create group chat.");
  }

  return res.json({ message: message200 });
});

module.exports = { createChat, createGroupChat, };