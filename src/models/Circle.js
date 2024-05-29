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
  startAdd:{
    type:String,
    default: "주소가 없습니다."
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
      // required: true,
    },
//     startTime: {
//       type: String,
//       //   required: true,
//       default: "00:00",
//     },
    startTime: {
      type: Date,
      //   required: true,
      default: 0,
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
  peoples:{
    type:Number,
    default:0
  },
  createAt: Date,
},
  {
    timestamps: true,
  }
);
const Circle = mongoose.model("circle", CircleSchema);
module.exports = Circle;
