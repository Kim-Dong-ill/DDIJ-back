const {default: mongoose} = require("mongoose");

const CommentSchema = new mongoose.Schema({
    Post_id: {
        type:  mongoose.Types.ObjectId,
        ref: "MyDogPost"
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
const Comment = mongoose.model("comment", CommentSchema);
module.exports = Comment;