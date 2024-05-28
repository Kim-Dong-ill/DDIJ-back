const { default: mongoose } = require("mongoose");
const CircleCommentSchema = new mongoose.Schema({
  circle: {
    type: mongoose.Types.ObjectId,
    ref: "circle",
  },

  content: {
    type: String,
    maxLength: 300,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  createdAt: Date,
});

const CircleComment = mongoose.model("circleComment", CircleCommentSchema);
module.exports = CircleComment;
