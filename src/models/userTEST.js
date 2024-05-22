const { mongoose, Types } = require("mongoose");

const userTESTchema = new mongoose.Schema({
    name: {
        type: String
    },
    location: {
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
const userTEST = mongoose.model("usertest", userTESTchema);
module.exports = userTEST;
