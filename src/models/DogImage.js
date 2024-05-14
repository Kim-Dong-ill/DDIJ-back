const {default: mongoose} = require("mongoose");

const DogImageSchema = new mongoose.Schema({
    Pet_id: {
        type:  mongoose.Types.ObjectId,
        ref: "Pet"
    },
    Image_id:{
        type:  mongoose.Types.ObjectId,
        ref: "Image"
    }
});
const DogImage = mongoose.model("dogimage", DogImageSchema);
module.exports = DogImage;