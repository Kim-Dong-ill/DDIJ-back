const mongoose = require("mongoose");

const LiveWorkingCircleSchema = mongoose.Schema({
    LiveWorkingCircle_id: {
        type: Number,
        required : true,
        unique:true
    },
    WorkingCircle_id: {
        type: Number,
        unique: true
    },
    isLive: {
        type: Boolean,
        default: false,
        required: true
    },
    isFull: {
        type: Boolean,
        default: false,
        required: true
    }
});
const LiveWorkingCircle = mongoose.model("liveworkingcircle", LiveWorkingCircleSchema);
module.exports = LiveWorkingCircle;