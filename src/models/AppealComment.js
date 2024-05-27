const mongoose = require("mongoose");
const AppealCommentSchema = new mongoose.Schema(
  {
    appealPost: {
      type: mongoose.Types.ObjectId,
      ref: "appealPost",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    text: {
      type: String,
      required: true,
    },
    petImage: {},
    createdAt: Date,
  }
  // { timestamps: true }
);

const AppealComment = mongoose.model("appealComment", AppealCommentSchema);
module.exports = AppealComment;
