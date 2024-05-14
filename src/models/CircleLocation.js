const {default: mongoose} = require("mongoose");

const CircleLocationSchema = new mongoose.Schema({
    WorkingCircle_id:{
        type:  mongoose.Types.ObjectId,
        ref: "WorkingCircle"
    },

    Loc_id: {
        type:  mongoose.Types.ObjectId,
        ref: "Location"
    },
});
const CircleLocation = mongoose.model("circleLocation", CircleLocationSchema);
module.exports = CircleLocation;