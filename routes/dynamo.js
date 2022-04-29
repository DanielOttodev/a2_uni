const express = require("express");
const router = express.Router();
const api = require("../api/dynamo.js");

router.post("/", api.createTable);
router.post("/seedData", api.seedItems);
router.get("/getSongs", api.getSongs);
router.post("/addSong", api.addSong);
router.post("/delSong", api.delSong);
module.exports = router;
