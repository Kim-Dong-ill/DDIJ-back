const { default: mongoose } = require("mongoose");

const PetImageTESTSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const PetImageTEST = mongoose.model("petimagetest", PetImageTESTSchema);
module.exports = PetImageTEST;
