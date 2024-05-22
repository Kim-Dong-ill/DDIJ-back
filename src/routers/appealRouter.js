const express = require("express");
const AppealPost = require("../models/AppealPost");
const AppealComment = require("../models/AppealComment");
const PostImage = require("../models/PostImage");
const upload = require("../middleware/imageUploads");
const path = require("path");
const fs = require("fs");
const appealRouter = express.Router();

// appealPost 관련된거 - post
appealRouter.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { text, mainPetId } = req.body;

    const appealPost = await new AppealPost({
      user: userId,
      mainPet: mainPetId,
      image: req.body.image,
      text: text,
      createdAt: new Date(),
    }).save();
    return res.status(200).send({ appealPost });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//appealPost 연습용!!! - get
appealRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const appealData = await AppealPost.find({ user: userId }).sort({
      createdAt: -1,
    });
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

// 댕댕 이미지 업로드
appealRouter.post("/:userId/image", upload.array("image"), async (req, res) => {
  try {
    const images = req.files.map((file) => file.filename);
    console.log("jaehee", images);

    // return res.status(200).send(req.file.filename);
    return res.status(200).send({ images });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 댕댕 이미지 삭제
appealRouter.delete("/:userId/image/:image", async (req, res) => {
  try {
    const { image } = req.params;
    const filePath = path.join(__dirname, "..", "..", "uploads", image);
    console.log("삭제", image);

    // 비동기 방식으로 파일 삭제
    await fs.promises.unlink(filePath);

    return res.status(200).send({ image });
  } catch (error) {
    console.log(error);
  }
});
module.exports = appealRouter;
