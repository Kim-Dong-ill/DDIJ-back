const mongoose = require("mongoose");

const LocationSchema = mongoose.Schema({
    Loc_id: {
        type: Number,
        required : true,
        unique:true
    },
    coords: {
        type: [Number],
        required: true
    },
    isWhat: {
        type: Boolean,    //true -> circle, false -> user
        default: false,
        required: true
    },equired: true,
    createAt: Date
});
const Location = mongoose.model("location", LocationSchema);
module.exports = Location;