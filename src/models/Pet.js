const { default: mongoose, Types } = require("mongoose");

const PetSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      required: true,
      ref: "user",
    },
    index: {
      type: Number,
      required: true,
      // 대표견은 무조건 1, 나머지 무조건 0
    },
    pName: {
      type: String,
      required: true,
      maxLength: 20,
    },
    image: {},
    pGender: {
      type: String,
      default: "male",
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
  },
  {
    timestamps: true,
  }
);

const Pet = mongoose.model("pet", PetSchema);
module.exports = Pet;
