"use strict";
const db = require("../../../../../../models/V1/index");
const { status, } = require("http-status");
const asyncHandler = require("express-async-handler");

const getChatList = asyncHandler(async (req, res) => {
  return res.json({ message: "Success" });
});

module.exports = { getChatList, };