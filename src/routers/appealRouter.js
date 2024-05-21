const express = require("express");
const AppealPost = require("../models/AppealPost");
const AppealComment = require("../models/AppealComment");
const appealRouter = express.Router();

// appealPost 관련된거 - post
appealRouter.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { text, mainPetId } = req.body;

    const appealPost = await new AppealPost({
      user: userId,
      mainPet: mainPetId,
      text: text,
      createdAt: new Date(),
    }).save();
    return res.status(200).send({ appealPost });
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

//appealPost 연습용!!! - get
appealRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const appealData = await AppealPost.find({}).sort({ createdAt: -1 });
    return res.status(200).send({ appealData });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// -=========================================================================

// comment 관련된거 - post
appealRouter.post("/:userId/comment", async (req, res) => {
  try {
    const { userId } = req.params;
    const { text, appealPostId } = req.body;
    console.log(appealPostId);
    const appealComment = await new AppealComment({
      appealPost: appealPostId,
      user: userId,
      text: text,
      createdAt: new Date(),
      // 왼쪽이 스키마랑 이름 똑같아야함.. 오른쪽은 위에서 내가 써준 변수들
      // 오른쪽꺼가 포스트맨쓸때 써야할값
    }).save();
    return res.status(200).send({ appealComment });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// comment 관련된거 - get
appealRouter.get("/:userId/comment", async (req, res) => {
  try {
    const { appealPostId } = req.query;
    const appealComment = await AppealComment.find({
      appealPost: appealPostId,
    }).sort({ createdAt: -1 });
    return res.status(200).send({ appealComment });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = AppealRouter;
