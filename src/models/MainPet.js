const { default: mongoose } = require("mongoose");

const MainPetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  pet: {
    type: mongoose.Types.ObjectId,
    ref: "pet",
  },
});

const MainPet = mongoose.model("mainPet", MainPetSchema);
module.exports = MainPet;
