const { default: mongoose } = require("mongoose");

const PetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  name: { 
    type: String, 
    // required: true
 },
  breed: {type: String, 
    // required: true},
  age: {},
  gender: {},
  isVaccin: {},
  isNeuter: {},
  isRabies: {},
  // image:{},
  createAt: Date,
});
const Pet = mongoose.model("pet", PetSchema);
module.exports = Pet;
