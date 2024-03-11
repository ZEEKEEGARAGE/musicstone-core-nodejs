const fs = require("fs");
const PlaylistService = require("../services/playlist.services");

exports.playlist_get = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    const playlist = await PlaylistService.getPlaylist(user_id);
    const remainToken = await PlaylistService.getRemainToken(user_id);
    playlist !== ""
      ? res.status(200).json({ remainToken, playlist })
      : res.status(200).send("playlist not exist!");
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.playlist_post = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    const stone_id = req.body.stoneId;
    const isOk = await PlaylistService.updatePlaylist(user_id, stone_id);
    if (isOk === 1) {
      res.status(201).json({ message: "Ok" });
    } else if (isOk === 0) {
      res.status(200).json({ message: "Alreay Exist in your Playlist!!" });
    } else if (isOk != {}) {
      res.status(201).json({ message: "Ok" });
    } else {
      res.status(500).json({ message: "Fail" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.playlist_streaming_get = async (req, res, next) => {
  try {
    const stone_id = req.params.stone_id;
    const path = await PlaylistService.getStonePath(stone_id);
    // streaming
    if (path !== "") {
      const stream = fs.createReadStream(path);
      stream.on("data", function (data) {
        res.write(data);
      });
      stream.on("end", function () {
        res.end();
      });
      stream.on("error", function (err) {
        res.end("500 Internal Server " + err);
      });
    } else {
      res
        .writeHead(404, { "Content-Type": "text/html" })
        .end("404 Page Not Found");
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.playlist_streaming_post = async (req, res, next) => {
  try {
    const stone_id = req.params.stone_id;
    const user_id = req.body.userId;
    const isOk = await PlaylistService.updateDeduction(stone_id, user_id);
    if (isOk === "Ok") {
      res.status(201).json({ message: "Ok" });
    } else {
      res.status(500).json({ message: isOk });
    }
  } catch (e) {
    throw Error(e);
  }
};

exports.playlist_delete_post = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const stoneId = req.body.stoneId;
    const isDel = await PlaylistService.deletePlayList(userId, stoneId);
    isDel
      ? res.status(201).json({ message: "Ok" })
      : res.status(500).json({ message: "Fail" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
