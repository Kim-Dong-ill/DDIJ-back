const mongoose = require("mongoose");

const DogImageSchema = mongoose.Schema({
    Pet_id: {
        type: Number
    },
    DogImage_id: {
        type: Number,
        unique: true
    },
    Image_id:{
        type:Number
    }
});
const DogImage = mongoose.model("dogimage", DogImageSchema);
module.exports = DogImage;