const express = require("express");
const router = express.Router();
const api = require("../api/s3.js");

router.get("/", api.getImages);

module.exports = router;
