"use strict";
const db = require("../../../../../models/V1/index");
const { status, } = require("http-status");
const asyncHandler = require("express-async-handler");
const { message500 } = require("../../../../../utils/httpResponses");
const { integerNumberRegex } = require("../../../../../utils/regexes");

const searchUsersList = asyncHandler(async (req, res) => {
  const page = req.query.page;
  if (page && null === `${page}`.match(integerNumberRegex)) {
    res.status(status.BAD_REQUEST);
    throw new Error(
      "The page query parameter, if provided, must be type integer.",
    );
  }
  
  const perPage = req.query.perPage;
  if (perPage && null === `${perPage}`.match(integerNumberRegex)) {
    res.status(status.BAD_REQUEST);
    throw new Error(
      "The per page query parameter, if provided, must be type integer.",
    );
  }
  
  const inputError = await db.sequelize.models
    .user
    .getSearchUsersError(req.query);
  if (false !== inputError) {
    res.status(status.BAD_REQUEST);
    throw new Error(inputError);
  }

  const cleanData = await db.sequelize.models
    .user
    .getCleanSearchUsersData({
      query: req.queryString("query"),
      excludingIDs: req.query.excludingIDs,
    });
  if (false === cleanData) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error(message500);
  }
  
  const searchedUsersList = await db.sequelize.models
    .user
    .searchUsersPaginated(
      req.session.userID,
      cleanData.query,
      cleanData.excludingIDs,
      page || 1,
      perPage || 7,
    );
  if (false === searchedUsersList) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error("Failed to search users list");
  }

  return res.json(searchedUsersList);
});

module.exports = { searchUsersList, };