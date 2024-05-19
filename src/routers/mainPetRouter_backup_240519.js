const express = require("express");
const MainPet = require("../models/MainPet");
const mainPetRouter = express.Router();

mainPetRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const mainPetId = await MainPet.findOne({ user: userId });
    res.status(200).send({ mainPetId });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = mainPetRouter;
