const express = require("express");
const router = express.Router();
const api = require("../api/register.js");

router.post("/", api.register);

module.exports = router;
