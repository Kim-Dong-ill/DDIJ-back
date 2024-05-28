const {default: mongoose} = require("mongoose");

const CircleCommentSchema = new mongoose.Schema({
    Circle_id: {
        type:  mongoose.Types.ObjectId,
        ref: "Circle"
    },

    content: {
        type: String,
        maxLength: 300,
        required:true
    },
    User_id: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    createdAt: Date,
});
const CircleComment = mongoose.model("circlecoment", CircleCommentSchema);
module.exports = CircleComment;