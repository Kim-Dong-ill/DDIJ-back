const express = require("express");
const Pet = require("../models/Pet");
const petRouter = express.Router();

petRouter.get("/list/:userId", async (req, res) => {
  try {
    let { userId } = req.params;
    const myPetList = await Pet.find({ user: userId });
    return res.status(200).send({ myPetList });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// petRouter.put("/:petId", async (req, res) => {
//   try {
//     let { petId } = req.params;
//     const temp = {
//       message: "마이펫이지-펫 정보 수정하기.",
//     };
//     return res.status(200).send(temp);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// petRouter.post("/modimg/:petId", async (req, res) => {
//   try {
//     let { petId } = req.params;
//     const temp = {
//       message: "펫이미지수정",
//     };
//     return res.status(200).send(temp);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// petRouter.delete("/:petId", async (req, res) => {
//   try {
//     let { petId } = req.params;
//     const temp = {
//       message: "펫정보삭제",
//     };
//     return res.status(200).send(temp);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// KED 240519 시작
petRouter.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      index,
      pName,
      image,
      pGender,
      pBreed,
      pCharOne,
      pAge,
      vaccine,
      neuter,
      rabies,
    } = req.body;
    const addPet = await new Pet({
      index,
      user: userId,
      pName,
      image,
      pGender,
      pBreed,
      pCharOne,
      pAge,
      vaccine,
      neuter,
      rabies,
      createdAt: new Date(),
    }).save();
    return res.status(200).send({ addPet });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 강아지정보 로드 -> 자랑하개에서 써먹을라고 시작햇음 240521_KED
petRouter.get("/pet/list/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const petList = await Pet.find({ user: userId });
    return res.status(200).send({ petList });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// appealRouter.delete("/pet/:petid", async (req, res) => {
//   try {
//     const { image } = req.params;

//     return res.status(200).send({ image });
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = petRouter;
