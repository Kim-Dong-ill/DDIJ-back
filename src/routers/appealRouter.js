const express = require("express");
const AppealRouter = express.Router();
const upload = require("../middleware/imageUploads");
const Pet = require("../models/Pet");

AppealRouter.get("/:userId", async (req, res) => {
  try {
    const temp = {
      message: "자랑글 불러오기 -> 이때 댓글도 불러와야함.",
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

AppealRouter.post("/image", upload.single("image"), async (req, res) => {
  try {
    console.log("파일 업로드 성공");
    console.log(req.file);
    return res.send(req.file.filename);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

AppealRouter.post("/:petid", async (req, res) => {
  try {
    const { petid } = req.params;
    const temp = {
      message: "게시글작성",
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

AppealRouter.post(
  "/:petid/comment",
  upload.single("image"),
  async (req, res) => {
    try {
      const { petid } = req.params;
      const temp = {
        message: "댓글작성.",
      };
      return res.status(200).send(temp);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

module.exports = AppealRouter;
