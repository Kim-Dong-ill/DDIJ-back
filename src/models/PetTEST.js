const { default: mongoose } = require("mongoose");
const petimagetest = require("PetImageTest")
const User = require("User")
const PetTESTSchema = new mongoose.Schema(
    {
        User: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "petimagetest",
        },
        index: {
            type: Number,
            required: true,
        },
        image: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: "PetImageTEST"
        },
        createAt: Date,
    },
    {
        timestamps: true,
    }
);

const PetTEST = mongoose.model("pettest", PetTESTSchema);
module.exports = PetTEST;
