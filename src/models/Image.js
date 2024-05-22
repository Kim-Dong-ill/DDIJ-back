const { default: mongoose } = require("mongoose");

const ImageSchema = new mongoose.Schema({
  ImageName: {
    type: String,
    unique: true,
    required: true,
  },
  ImagePath: {
    type: String,
    unique: true,
    required: true,
  },
  key: {
    type: String,
    // required: false,
  },
  originalFileName: { type: String },

  createAt: Date,
});
const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;
