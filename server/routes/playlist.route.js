const express = require("express");
const router = express.Router();
const controller = require("../controller/playlist.controller");

router.get("/:user_id", controller.playlist_get);
router.post("/:user_id", controller.playlist_post);
router.get("/streaming/:stone_id", controller.playlist_streaming_get);
router.post("/streaming/:stone_id", controller.playlist_streaming_post);
router.post("/delete/:user_id", controller.playlist_delete_post);

module.exports = router;
