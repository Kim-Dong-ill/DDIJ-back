const { default: mongoose } = require("mongoose");

const PostImageSchema = new mongoose.Schema({
  Post_id: {
    type: mongoose.Types.ObjectId,
    ref: "Post",
  },
  Image_id: {
    type: mongoose.Types.ObjectId,
    ref: "Image",
  },
  images: {
    type: Array,
    default: [],
    maxlength: 3, // 최대 3개의 사진까지만 허용
  },
});
const PostImage = mongoose.model("postimage", PostImageSchema);
module.exports = PostImage;
