const {default: mongoose} = require("mongoose");
const {tr} = require("@faker-js/faker");

const PetImageSchema = new mongoose.Schema({
    Pet_id: {
        type:  mongoose.Types.ObjectId,
        ref: "Pet"
    },
    imageName:{
        type:  String,
        require:true
    },
    imagePath:{
        type:  String,
        default: "DDIJ-back/static/images/dog1.svg"
    }
});
const PetImage = mongoose.model("petimage", PetImageSchema);
module.exports = PetImage;