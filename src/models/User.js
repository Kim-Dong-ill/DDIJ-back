const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxLength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        minLength: 4,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    createdAt: Date,
});
const User = mongoose.model("user", userSchema);
module.exports = User;
