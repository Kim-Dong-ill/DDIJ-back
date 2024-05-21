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
const PetImage = mongoose.model("dogimage", DogImageSchema);
module.exports = PetImage;