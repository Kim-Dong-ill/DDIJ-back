const {default: mongoose} = require("mongoose");

const PetSchema = new mongoose.Schema({
    User_id: {
        type:  mongoose.Types.ObjectId,
        ref: "User"
    },
    petName: {
        type: String,
        required: true,
        maxLength: 20
    },
    isHaveImage: {
        type: Boolean,    //true -> have image, false -> NOT
        default: false,
        required:true
    },
    image:{
        type:  mongoose.Types.ObjectId,
        ref: "DogImage"
    },
    gender: {
        type: Boolean,    //true -> male, false -> female
        default: false,
        required:true
    },
    breed: {
        type: String,
        default: "dog",
        required:true,
        maxLength: 20
    },
    age: {
        type: Number,
        required:true
    },
    vaccine: {
        type: Number,
        required: true,
        default:0
    },
    createAt: Date
});
const Pet = mongoose.model("pet", PetSchema);
module.exports = Pet;