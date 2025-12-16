'use strict';
const express = require('express');
const { getUsers, getUnpaginatedUsers, } = require('../../../../controllers/API/V1/web/usersControllers');

const router = express.Router();

router.route("/").get(getUsers);
router.route("/all").get(getUnpaginatedUsers);

module.exports = router;