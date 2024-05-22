const { mongoose, Types } = require("mongoose");

const WorkingCircleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  // start_loc: {
  //   type: [Number],
  //   required: true,
  // },
  // end_loc: {
  //   type: [Number],
  //   required: true,
  // },
  // now: {
  //   type: Number,
  //   // required: true,
  //   default: 0,
  // },
  max: {
    type: String,
    required: true,
    default: 0,
  },
  startDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
  },
  usingTime: {
    type: String,
    required: true,
  },
  UserId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  createAt: Date,
});
const WorkingCircle = mongoose.model("workingcircle", WorkingCircleSchema);
module.exports = WorkingCircle;
