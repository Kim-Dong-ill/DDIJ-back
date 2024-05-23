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
    images: [
      {
        type: String,
      },
    ],

    createdAt: Date,
  },
  { timestamps: true }
);
const AppealPost = mongoose.model("appealPost", AppealPostSchema);
module.exports = AppealPost;
