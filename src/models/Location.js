const {default: mongoose} = require("mongoose");

const LocationSchema = new mongoose.Schema({
    coords: {
        type: [Number],
        required: true
    },
    isWhat: {
        type: Boolean,    //true -> circle, false -> user
        default: false,
        required: true
    },
    createAt: Date
});
const Location = mongoose.model("location", LocationSchema);
module.exports = Location;