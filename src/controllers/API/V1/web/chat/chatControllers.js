"use strict";
const asyncHandler = require("express-async-handler");
const db = require("../../../../../models/V1");
const { default: status } = require("http-status");
const { message400, } = require("../../../../../utils/httpResponses");

const createChat = asyncHandler(async (req, res) => {
  const inputError = await db.sequelize.models.chat
    .getCreateChatError(req.body, req.session.userID);
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

  const chatExists = await db.sequelize.models.chat
    .checkChatExists(
      req.session.userID,
      cleanData.userID,
    );
  if (true === chatExists) {
    res.status(status.CONFLICT);
    throw new Error("Chat between yourself and the given user already exists.");
  }
  // return res.json({message:"force failing"})
  const createChat = await db.sequelize.models.chat
    .createChat(
      [req.session.userID, cleanData.userID]
    );
  if (false === createChat) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error("Failed to create chat.");
  }
  
  const chat = await db.sequelize.models.chat
    .getChat(createChat.chatID);
  if (false === chat) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error("Failed to retrieve created chat.");
  }

  return res.json({ data: chat });
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

  const chat = await db.sequelize.models.chat
    .getChat(createChat.chatID);
  if (false === chat) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error("Failed to retrieve created group chat.");
  }

  return res.json({ data: chat });
});

module.exports = { createChat, createGroupChat, };