const {default: mongoose} = require("mongoose");

const ImageSchema = new mongoose.Schema({
    ImageName: {
        type: String,
        unique:true,
        required:true
    },
    ImagePath:{
        type:String,
        unique:true,
        required:true
    },
    createAt:Date,
});
const Image = mongoose.model("image", ImageSchema);

module.exports = Image;