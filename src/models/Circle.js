const { default: mongoose, Types } = require("mongoose");

const CircleSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
    name: {
      type: String,
      default: "empty",
      required: true,
    },
    text: {
      type: String,
      required: true,
      default: "empty",
    },
    startLoc: {
      type: {
        type: String,
        enum: ["Point"], // 위치 타입은 'Point'로 제한
        default: "Point", // GeoJSON 타입은 기본적으로 'Point'로 설정
      },
      coordinates: {
        type: [Number], // 경도와 위도를 순서대로 배열로 저장 (GeoJSON 형식)
        index: "2dsphere", // GeoJSON 인덱스 생성 (지리적 위치 검색을 위해)
      },
    },
    endLoc: {
      type: String,
      // required: true,
    },
    startTime: {
      type: String,
      //   required: true,
      default: "00:00",
    },
    startDate: {
      type: Date,
      //   required: true,
      default: 0,
    },
    usingTime: {
      type: String,
      // required: true,
    },
    peoples: {
      type: Number,
    },
    complete: {
      type: Boolean,
      // required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Circle = mongoose.model("circle", CircleSchema);
module.exports = Circle;
