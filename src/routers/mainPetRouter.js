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

//  대표펫 바꾸기 시작??
mainPetRouter.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const updatedMainPet = await MainPet.findOneAndUpdate(
      { user: userId },
      req.body,
      { new: true }
    );
    // { new: true } 옵션을 통해 업데이트된 문서를 반환합니다.
    res.status(200).send(updatedMainPet);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
module.exports = mainPetRouter;
