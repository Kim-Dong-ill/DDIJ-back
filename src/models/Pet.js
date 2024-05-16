const { default: mongoose } = require("mongoose");

const PetSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  pName: {
    type: String,
    required: true,
    maxLength: 20,
  },
  image: {
    type: mongoose.Types.ObjectId,
    ref: "DogImage",
  },
  pGender: {
    type: String,
    default: "남",
    required: true,
  },
  pBreed: {
    type: String,
    default: "dog",
    required: true,
    maxLength: 20,
  },
  pCharOne: {
    type: String,
    required: true,
    // maxLength: 30,
  },
  pAge: {
    type: Number,
    required: true,
  },
  vaccine: {
    type: Boolean,
    required: true,
    default: false,
  },
  neuter: {
    type: Boolean,
    required: true,
    default: false,
  },
  rabies: {
    type: Boolean,
    required: true,
    default: false,
  },
  createAt: Date,
});
const Pet = mongoose.model("pet", PetSchema);
module.exports = Pet;
