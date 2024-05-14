const mongoose = require("mongoose");

const MyDogPostSchema = new mongoose.Schema({
    Pet_id: {
        type:  mongoose.Types.ObjectId,
        ref: "Pet",
        required: true
    },
    title: {
        type: String,
        required: true,
        maxLength: 100,
    },
    text: {
        type: String,
        required: true,
        maxLength: 500,
        default:"안녕하세요"
    },
    etc: {
        type: String,
        maxLength: 300,
    },
    howManyImage: {
        type: Number,
        required: true,
        default:0
    },
    PostImage: [{
        type:  mongoose.Types.ObjectId,
        ref: "PostImage"
    }],
    comment: [{
        type:  mongoose.Types.ObjectId,
        ref: "Comment"
    }],
    createAt: Date
});
const MyDogPost = mongoose.model("mydogpost", MyDogPostSchema);
module.exports = MyDogPost;