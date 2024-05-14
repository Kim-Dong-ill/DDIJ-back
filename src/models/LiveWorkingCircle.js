const {default: mongoose} = require("mongoose");

const LiveWorkingCircleSchema = new mongoose.Schema({
    WorkingCircle_id: {
        type:  mongoose.Types.ObjectId,
        ref: "WorkingCircle",
        required:true
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