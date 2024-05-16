const express = require("express");
const MyDogPost = require("../models/MyDogPost");
const appealRouter = express.Router();

// AppealRouter.get("/:petid", async (req, res) => {
//   try {
//     const temp = {
//       message: "자랑글 불러오기 -> 이때 댓글도 불러와야함.",
//     };
//     return res.status(200).send(temp);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

appealRouter.post("/:petid", async (req, res) => {
  try {
    const { petid } = req.params;
    const { text } = req.body;
    const mydogpost = await new MyDogPost({ petid, text }).save();
    return res.status(200).send({ mydogpost });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
appealRouter.get("/:petid", async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// AppealRouter.post("/:petid/comment", async (req, res) => {
//   try {
//     const { petid } = req.params;
//     const temp = {
//       message: "댓글작성.",
//     };
//     return res.status(200).send(temp);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

module.exports = appealRouter;
