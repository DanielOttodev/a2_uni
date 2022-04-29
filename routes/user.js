const express = require("express");
const router = express.Router();
const api = require("../api/user.js");

router.post("/", api.userDetail);

module.exports = router;
