const mongoose = require("mongoose");

const CircleLocationSchema = mongoose.Schema({
    WorkingCircle_id: {
        type: Number,

    },
    Loc_id: {
        type: Number,
    }
});
const CircleLocation = mongoose.model("circleLocation", CircleLocationSchema);
module.exports = CircleLocation;