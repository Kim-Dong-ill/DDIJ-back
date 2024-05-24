const { default: mongoose } = require("mongoose");

const ImageSchema = new mongoose.Schema({
key: {
    type: String,
    // required: false,
  },
  originalFileName: { type: String },

  createAt: Date,
});
const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;
