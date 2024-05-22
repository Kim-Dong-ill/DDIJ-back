const { mongoose, Types } = require("mongoose");

const CircleSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  text: {
    type: String,
    // required: true,
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
    }
  },
  end_loc: {
    type: {
      type: String,
      enum: ["Point"], // 위치 타입은 'Point'로 제한
      default: "Point", // GeoJSON 타입은 기본적으로 'Point'로 설정
    },
    coordinates: {
      type: [Number], // 경도와 위도를 순서대로 배열로 저장 (GeoJSON 형식)
      index: "2dsphere", // GeoJSON 인덱스 생성 (지리적 위치 검색을 위해)
    }
  },
  startTime: {
    type: Date
  },
  usingTime: {
    type: Date,
    default: 0
  },
  UserId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  createAt: Date,
});
const Circle = mongoose.model("circle", WorkingCircleSchema);
module.exports = Circle;
