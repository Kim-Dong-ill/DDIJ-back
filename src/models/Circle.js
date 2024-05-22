const { mongoose, Types } = require("mongoose");

const WorkingCircleSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  content: {
    type: String,
    // required: true,
  },
  start_loc: {
    type: [Number],
    required: true,
  },
  end_loc: {
    type: [Number],
    required: true,
  },
  now: {
    type: Number,
    required: true,
    default: 0,
  },
  max: {
    type: Number,
    required: true,
    default: 0,
  },
  startTime: {
    type: Date,
  },
  usingTime: {
    type: Number,
  },
  UserId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  createAt: Date,
});
const Circle = mongoose.model("workingcircle", WorkingCircleSchema);
module.exports = Circle;
