const mongoose = require("mongoose");

const AppealPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    text: {
      type: String,
      required: true,
    },
    images: [],

    createdAt: Date,
    // image: {}, // 얘는 잘 모름
  },
  { timestamps: true }
);
const AppealPost = mongoose.model("appealPost", AppealPostSchema);
module.exports = AppealPost;
