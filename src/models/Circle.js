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
    startAdd: {
      type: String,
      default: "주소가 없습니다.",
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
      endCoordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
    startTime: {
      type: Date,
      //required: true,
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
    createAt: Date,
  },
  { timestamps: true }
);

const Circle = mongoose.model("circle", CircleSchema);
module.exports = Circle;
