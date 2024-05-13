const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
    Post_id: {
        type: Number
    },
    Comment_id: {
        type: Number,
        unique: true
    },
    content: {
        type: String,
        maxLength: 300,
        required:true
    },
    User_id: {
        type: Number
    },
    createdAt: Date,
});
const Comment = mongoose.model("comment", CommentSchema);
module.exports = Comment;