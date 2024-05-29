
const { default: mongoose } = require("mongoose");
const CircleCommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },

  circle: {
    type: mongoose.Types.ObjectId,
    ref: "circle",
  },

  content: {
    type: String,
    maxLength: 50,
    required: true,
  },
  createdAt: Date,
});

const CircleComment = mongoose.model("circleComment", CircleCommentSchema);
module.exports = CircleComment;

