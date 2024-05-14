import React, {Component} from 'react';
const {default: mongoose} = require("mongoose");

const UserLocationSchema = new mongoose.Schema({
    User_id: {
        type:  mongoose.Types.ObjectId,
        ref: "User"
    },
    Loc_id: {
        type:  mongoose.Types.ObjectId,
        ref: "Location"
    }
});
const UserLocation = mongoose.model("userlocation", UserLocationSchema);
module.exports = UserLocation;