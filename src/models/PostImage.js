const {default: mongoose} = require("mongoose");

const PostImageSchema = new mongoose.Schema({
    Post_id: {
        type:  mongoose.Types.ObjectId,
        ref: "Post"
    },
    Image_id:{
        type:  mongoose.Types.ObjectId,
        ref: "Image"
    },
});
const PostImage = mongoose.model("postimage", PostImageSchema);
module.exports = PostImage;