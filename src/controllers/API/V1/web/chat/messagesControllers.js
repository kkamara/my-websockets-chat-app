"use strict";
const asyncHandler = require("express-async-handler");
const db = require("../../../../../models/V1");
const { default: status } = require("http-status");
const { message400, message200 } = require("../../../../../utils/httpResponses");

const getMessages = asyncHandler(async (req, res) => {
  const inputError = db.sequelize.models
    .chat
    .getChatMessagesError(req.params.chatID);
  if (false !== inputError) {
    res.status(status.BAD_REQUEST);
    throw new Error(inputError);
  }

  const cleanData = db.sequelize.models
    .chat
    .getChatMessagesData(req.paramInt("chatID"));
  if (false === cleanData) {
    res.status(status.BAD_REQUEST);
    throw new Error(message400);
  }

  const chat = await db.sequelize.models
    .chat
    .getChat(cleanData.chatID);
  if (false === chat) {
    res.status(status.BAD_REQUEST);
    throw new Error("Chat not found.");
  }

  const chatUsers = await db.sequelize.models
    .chatUsers
    .getChatUsers(cleanData.chatID);
  if (false === chatUsers) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error("Unable to find chat users.");
  }

  let authUserIsInChat = false;
  for(const chatUser of chatUsers) {
    if (chatUser.userID === req.session.userID) {
      authUserIsInChat = true;
      break;
    }
  }

  if (false === authUserIsInChat) {
    res.status(status.FORBIDDEN);
    throw new Error("You are not a member of this chat.");
  }

  const messages = await db.sequelize.models
    .chatMessage
    .getChatMessages(cleanData.chatID);
  if (false === messages) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error("Unable to get chat messages.");
  }

  chat.messages = messages;
  
  return res.json({ data: chat });
});

const createMessage = asyncHandler(async (req, res) => {
  const inputError = db.sequelize.models
    .chatMessage
    .getCreateChatMessageError(
      req.params.chatID,
      req.body.content,
    );
  if (false !== inputError) {
    res.status(status.BAD_REQUEST);
    throw new Error(inputError);
  }

  const cleanData = db.sequelize.models
    .chatMessage
    .getCreateChatMessageData(
      req.paramInt("chatID"),
      req.bodyString("content"),
    );
  if (false === cleanData) {
    res.status(status.BAD_REQUEST);
    throw new Error(message400);
  }

  const chat = await db.sequelize.models
    .chat
    .getChat(cleanData.chatID);
  if (false === chat) {
    res.status(status.BAD_REQUEST);
    throw new Error("Chat not found.");
  }

  const chatUsers = await db.sequelize.models
    .chatUsers
    .getChatUsers(cleanData.chatID);
  if (false === chatUsers) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error("Unable to find chat users.");
  }

  let authUserIsInChat = false;
  for(const chatUser of chatUsers) {
    if (chatUser.userID === req.session.userID) {
      authUserIsInChat = true;
      break;
    }
  }

  if (false === authUserIsInChat) {
    res.status(status.FORBIDDEN);
    throw new Error("You are not a member of this chat.");
  }

  const createdMessage = await db.sequelize.models
    .chatMessage
    .createChatMessage(
      req.session.userID,
      cleanData.chatID,
      cleanData.content,
    );
  if (false === createdMessage) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error("Unable to create chat message.");
  }

  const message = await db.sequelize.models
    .chatMessage
    .getChatMessage(createdMessage.chatMessageID);
  if (false === message) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error("Unable to get created chat message.");
  }

  await db.sequelize.models
    .chat
    .updateChatTimestamp(cleanData.chatID);
  
  return res.json({ data: message });
});

module.exports = { getMessages, createMessage, };