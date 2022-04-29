const express = require("express");
const router = express.Router();
const api = require("../api/login.js");

router.post("/", api.auth);

module.exports = router;
