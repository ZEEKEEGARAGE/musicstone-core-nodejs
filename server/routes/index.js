const express = require("express");
const router = express.Router();

const main = require("./main.route");
const musician = require("./musician.route");
const playlist = require("./playlist.route");
const stones = require("./stones.route");
const user = require("./user.route");
const album = require("./album.route");

router.use("/", main);

router.use("/musician", musician);
router.use("/playlist", playlist);
router.use("/stones", stones);
router.use("/user", user);
router.use("/album", album);

const test = require("./test.route");
router.use("/test", test);

module.exports = router;
