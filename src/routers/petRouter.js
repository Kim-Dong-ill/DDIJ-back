const express = require("express");
const Pet = require("../models/Pet");
const upload = require("../middleware/imageUploads");
const petRouter = express.Router();
const path = require("path");
const fs = require("fs");

petRouter.get("/list/:userId", async (req, res) => {
  try {
    let { userId } = req.params;
    const myPetList = await Pet.find({ user: userId }).sort({ index: -1 });
    return res.status(200).send({ myPetList });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

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
    const { userId } = req.body;
    const petList = await Pet.find({ user: userId });
    return res.status(200).send({ petList });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//

// 강아지 index값 수정하려고 만든 api -> 대표강아지 설정시 이용합니다.
petRouter.patch("/mainpetindex", async (req, res) => {
  try {
    const { petId1, petId2 } = req.body; // 요청 본문에서 두 개의 petId를 가져옴

    // 두 개의 petId를 사용해 각각의 펫을 찾음
    // const pet1 = await Pet.findById(petId1);
    // const pet2 = await Pet.findById(petId2);
    const pet1 = await Pet.findOne({ _id: petId1 }); // 수정
    const pet2 = await Pet.findOne({ _id: petId2 }); // 수정

    // 각각의 펫이 존재하는지 확인
    if (!pet1 || !pet2) {
      return res.status(404).send("One or both pets not found");
    }

    // 두 펫의 index 값을 서로 맞바꿈
    const tempIndex = pet1.index;
    pet1.index = pet2.index;
    pet2.index = tempIndex;

    // 변경된 값을 저장
    await pet1.save();
    await pet2.save();

    // 업데이트된 펫 정보를 응답
    return res.status(200).send({ pet1, pet2 });
  } catch (error) {
    console.error("Server Error:", error); // 오류 메시지 로그 기록
    res.status(500).send(error.message);
  }
});

//마이펫이지 수정관련
petRouter.put("/modify", async (req, res) => {
  try {
    const petData = req.body;
    // console.log("--------------------", petData);

    const fetchPet = await Pet.findByIdAndUpdate(
      petData._id,
      {
        $set: {
          pName: petData.pName,
          image: petData.image,
          pBreed: petData.pBreed,
          pCharOne: petData.pCharOne,
          pAge: petData.pAge,
          vaccine: petData.vaccine,
          neuter: petData.neuter,
          rabies: petData.rabies,
        },
      },
      {
        new: true,
      }
    );
    console.log(")))))))))))))))))", fetchPet);
    // const pet = await Pet.findOne({ _id: petId });
    // if (!pet) {
    //   return res.send({ message: "반려견이 없습니다." });
    // }

    return res.send(petData);
  } catch (error) {
    console.error("Server Error:", error); // 오류 메시지 로그 기록
    return res.status(500).send(error.message);
  }
});

//마이펫 이미지 파일 업로드
petRouter.post("/modify/image", upload.single("image"), async (req, res) => {
  try {
    const fetchImage = req.file.filename;

    return res.status(200).send({ fetchImage });
  } catch (error) {
    console.error("Server Error:", error); // 오류 메시지 로그 기록
    return res.status(500).send(error.message);
  }
});

//마이펫 이미지 파일 삭제
petRouter.delete("/modify/image/:petImage", async (req, res) => {
  try {
    const { petImage } = req.params;
    const filePath = path.join(__dirname, "..", "..", "uploads", petImage);

    // 비동기 방식으로 파일 삭제
    await fs.promises.unlink(filePath);

    return res.status(200).send({ petImage });
  } catch (error) {
    console.error("Server Error:", error); // 오류 메시지 로그 기록
    return res.status(500).send(error.message);
  }
});

module.exports = petRouter;

// 유저 유저수정 펫리스트보기 펫리스트수정 제외하고 나머지..?
