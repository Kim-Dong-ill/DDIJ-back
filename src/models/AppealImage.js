const { default: mongoose } = require("mongoose");

const AppealImageSchema = new mongoose.Schema({
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
const AppealImage = mongoose.model("appealimage", AppealImageSchema);
module.exports = AppealImage;
