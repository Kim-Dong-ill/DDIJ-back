const mongoose = require("mongoose");

const AppealPostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    // _id 쓰겠다는 의미?
    ref: "user",
    // 참조 데이터 __ 스키마 export해올 때 "___"요기다 적은거
  },

  pet: {
    type: mongoose.Types.ObjectId,
    ref: "pet",
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: Date,
  // image: {}, // 얘는 잘 모름
});
const AppealPost = mongoose.model("appealPost", AppealPostSchema);
module.exports = AppealPost;
