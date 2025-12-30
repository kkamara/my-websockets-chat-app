"use strict";
const asyncHandler = require("express-async-handler");
const db = require("../../../../../models/V1");
const { default: status } = require("http-status");
const { message400 } = require("../../../../../utils/httpResponses");

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
    .getChatMessagesData(req.params.chatID);
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

module.exports = { getMessages };