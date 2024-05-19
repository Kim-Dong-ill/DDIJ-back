const mongoose = require("mongoose");

const AppealPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    mainPet: {
      type: mongoose.Types.ObjectId,
      ref: "mainPet",
    },
    text: {
      type: String,
      required: true,
    },

    createdAt: Date,
    // image: {}, // 얘는 잘 모름
  },
  { timestamps: true }
);
const AppealPost = mongoose.model("appealPost", AppealPostSchema);
module.exports = AppealPost;
