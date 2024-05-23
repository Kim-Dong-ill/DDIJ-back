const { mongoose, Types } = require("mongoose");

const userTESTSchema = new mongoose.Schema({
    name: {
        type: String
    },
    Pets:[ {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Pet"
    }],
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
const userTEST = mongoose.model("usertest", userTESTSchema);
module.exports = userTEST;
