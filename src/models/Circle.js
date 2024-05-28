const { mongoose, Types } = require("mongoose");
const CircleSchema = new mongoose.Schema({
  Users:[{
    type: mongoose.Types.ObjectId,
    ref: "User"
  }],
  name: {
    type: String,
    required: true,
    default: "empty"
  },
  text: {
    type: String,
    required: true,
    default: "empty"
  },
  startLoc: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
        index: "2dsphere",
    },
  },
  endLoc: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number]
    },
  },
  startTime: {
    type: Date,
    required: true,
    default:Date.now
  },
  usingTime: {
    type: Date,
    required: true,
    default:0
  },
  complete:{
    type:Boolean,
    default: false
  },
  createAt: Date,
});
const Circle = mongoose.model("circle", CircleSchema);
module.exports = Circle;
