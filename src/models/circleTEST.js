const { mongoose, Types } = require("mongoose");

const circleTESTSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
    },
    startLoc: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number],
            index: "2dsphere"
        }
    }
});
const circleTEST = mongoose.model("circletest", circleTESTSchema);
module.exports = circleTEST;
