const { mongoose, Types } = require("mongoose");
const CircleSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
    },

    name: {
      type: String,
      required: true,
      default: "empty",
    },
    text: {
      type: String,
      required: true,
      default: "empty",
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
      // startDate: {
      //   type: Date,
      //   //   required: true,
      //   default: 0,
      // },
    },
    startAdd: {
      type: String,
    },
    endLoc: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      endCoordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },

    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    usingTime: {
      type: Date,
      required: true,
      default: 0,
    },
    peoples: {
      type: Number,
      default: 0,
      required: true,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    peoples: {
      type: Number,
      default: 0,
    },
    createAt: Date,
  },
  {
    timestamps: true,
  }
);
const Circle = mongoose.model("circle", CircleSchema);
module.exports = Circle;
