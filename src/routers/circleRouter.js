const express = require("express");
const Pet = require("../models/Pet"); //나중에 pet으로 변경
const User = require("../models/User"); //나중에 user로 변경
const { default: mongoose } = require("mongoose");
const Circle = require("../models/Circle");
const circleRouter = express.Router();

function addFinishTime(circle) {
  let circleObj = circle.toObject();
  circleObj.finishTime = new Date(
    circle.startTime.getTime() + circle.usingTime.getTime()
  );
  return circleObj;
}

function checkDone(circleData) {
  if (circleData.startTime.getTime() <= Date.now()) {
    circleData.complete = true;
  }
  return circleData;
}

// -> 그냥 모든 모임 리스틀 다 보여준다. // 이떄 자신이 참여중인 목록을 따로 넘겨받는다.
circleRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 전체 모임리스트를 페이지네이션해 조회
    let allCircles = await Circle.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    let updatedCircles = await Promise.all(
      allCircles.map(async (circle) => {
        if (circle.Users.length > 0) {
          circle = addFinishTime(circle);
          circle = checkDone(circle);
          circle.mainPet = "";
          const userId = circle.Users[0]._id;
          const user = await User.findById(userId).exec();
          //   if (user) {           아래는 mainpet의 img를 추가하려고 작업했던것,
          //     const petImage = (await Pet.findById(user.mainPet).exec()).toObject()
          //     console.log(petImage.img)
          //     if (petImage) {
          //       circle.mainPet = petImage.imagePath;
          //     }
          // }
        }
        return circle;
      })
    );
    let userCircles = await Circle.find({ Users: userid }).exec();
    let tempUserCircles = await Promise.all(
      userCircles.map(async (circle) => {
        circle = addFinishTime(circle);
        circle = checkDone(circle);
        circle.mainPet = " ";
        return circle;
      })
    );
    const temp = {
      allCircles: updatedCircles,
      userCircles: tempUserCircles,
      currentPage: page, // 현재페이지 번호 page: default 1
      totalPages: Math.ceil((await Circle.countDocuments()) / limit),
    };

    return res.status(200).send(temp);
    //
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 유저의 좌표를 받아와 유저 근처에 있는모임 목록 ()개와, 시간순으로 뽑은 모임 ()개를 보내준다.
circleRouter.post("/:userid", async (req, res) => {
  try {
    const calculateDistance = (coord1, coord2) => {
      const [lat1, lon1] = coord1;
      const [lat2, lon2] = coord2;

      const earthRadius = 6371e3;

      const lat1Rad = (lat1 * Math.PI) / 180;
      const lat2Rad = (lat2 * Math.PI) / 180;
      const deltaLatRad = ((lat2 - lat1) * Math.PI) / 180;
      const deltaLonRad = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
        Math.cos(lat1Rad) *
          Math.cos(lat2Rad) *
          Math.sin(deltaLonRad / 2) *
          Math.sin(deltaLonRad / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = earthRadius * c;

      return distance;
    };

    const { userid } = req.params;
    const { userLocation } = req.body;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 전체 모임리스트를 페이지네이션해 조회
    const allCircles = await Circle.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    let circlesByNear = [...allCircles].sort((a, b) => {
      const distA = calculateDistance(userLocation, a.startLoc.coordinates);
      const distB = calculateDistance(userLocation, b.startLoc.coordinates);
      return distA - distB;
    });

    let circlesByTime = [...allCircles].sort(
      (a, b) => new Date(a.startTime) - new Date(b.startTime)
    );

    const userCircleByTime = circlesByTime.filter((circle) =>
      circle.Users.some((user) => user.toString() === userid)
    );

    const userCircleByDist = circlesByNear.filter((circle) =>
      circle.Users.some((user) => user.toString() === userid)
    );

    const temp = {
      byDist: circlesByNear,
      byDate: circlesByTime,
      userByDist: userCircleByDist,
      userByDate: userCircleByTime,
      currentPage: page, // 현재페이지 번호 page: default 1
      totalPages: Math.ceil((await Circle.countDocuments()) / limit),
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 모임 상세 정보 get -> 선택한 모임의 상세 정보를 보여줘야 한다. => 보여줘야할 정보는 ()이다.
circleRouter.get("/detail/:circleid", async (req, res) => {
  try {
    // 모임정보 찾기
    const { circleid } = req.params;
    // 해당하는 모임정보
    const circle = await Circle.findById(circleid);
    circleData = addFinishTime(circle);
    circleData = checkDone(circleData);
    console.log(circleData);

    if (!circle) {
      return res.status(404).json({ message: "모임을 찾을 수 없습니다." });
    }
    const user = await User.findById(circle.Users[0]).exec();

    if (!user) {
      return res.status(404).json({ message: "대표유저를 찾을 수 없습니다." });
    }

    const mainPet = await Pet.findById(user.mainPet).exec();
    if (!mainPet) {
      return res
        .status(404)
        .json({ message: "대표 반려견을 찾을 수 없습니다." });
    }

    const temp = {
      message:
        "circle에 대한 상세정보, Start_Loc는 지도를 찍어주고, name, text, startTime등을 활용",
      circle: circleData,
      User: user,
      mainPet: mainPet,
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 모임정보 수정 => 클라이언트로부터 자료를 받아와 db에 덮어쓴다.
circleRouter.put("/:circleid", async (req, res) => {
  try {
    const { circleid } = req.params;
    const updatedCircle = {
      name: req.body.name,
      text: req.body.text,
      startLoc: {
        type: "Point",
        coordinates: req.body.startLoc.coordinates,
      },
      endLoc: {
        type: "Point",
        coordinates: req.body.endLoc.coordinates,
      },
      startTime: req.body.startTime,
      usingTime: req.body.usingTime,
      complete: req.body.complete,
    };

    const result = await Circle.findByIdAndUpdate(circleid, updatedCircle, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      return Res.status(404).json({ message: "모임을 찾을 수 없습니다." });
    }

    const temp = {
      message: "모임 정보 수정.",
      updatedCircle,
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 모임 삭제 -> 프론트에서 삭제가 반영되어야 한다.
circleRouter.delete("/:circleid", async (req, res) => {
  try {
    const { circleid } = req.params;

    const deleteCircle = await Circle.findByIdAndDelete(circleid); // 모임정보 삭제

    if (!deleteCircle) {
      return res.status(404).send({ message: "모임을 찾을 수 없습니다." });
    }
    for (const userId of deleteCircle.Users) {
      await User.findByIdAndUpdate(userId, { $pull: { circles: circleid } });
    }
    const temp = {
      message: "모임 정보 삭제.",
      deleteCircle,
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//모임참석을 누른 사용자의 정보를 추가해야한다.
circleRouter.post("/:circleid/join", async (req, res) => {
  try {
    const { circleid } = req.params;
    const { userId } = req.body;

    // 모임 정보 찾기
    const circle = await Circle.findById(circleid);

    if (!circle) {
      return res.status(404).send({ message: "모임을 찾을 수 없습니다." });
    }

    if (circle.complete) {
      return res.status(404).send({ message: "이미 완료된 모임입니다.." });
    }

    if (circle.Users.length >= 5) {
      return res.status(404).send({ message: "모임의 정원이 가득 찼습니다." });
    }

    if (circle.Users.includes(userid)) {
      return res.status(400).send({ message: "이미 모임에 참석했습니다." });
    }

    circle.Users.push(userid);

    await circle.save();

    const temp = {
      message: "모임 참석.",
      circle,
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//해당 사용자가 모임에 참여중이라면, 해당 기록을 삭제한다. 참여중이 아니라면, false
circleRouter.post("/:circleid/cancel", async (req, res) => {
  try {
    const { circleid } = req.params;
    const { userid } = req.body;

    // 모임 정보 찾기
    const circle = await Circle.findById(circleid);
    if (!circle) {
      return res.status(404).send({ message: "모임을 찾을 수 없습니다." });
    }

    // 유저가 모임에 참석했는지 확인
    const userIndex = circle.UserId.indexOf(userid);
    if (userIndex === -1) {
      return res
        .status(400)
        .send({ message: "유저가 모임에 참석하지 않았습니다." });
    }

    // 유저 제거
    circle.UserId.splice(userIndex, 1);

    // 현재 참석자 수 업데이트
    circle.now = circle.UserId.length;

    // 변경 사항 저장
    await circle.save();

    const temp = {
      message: "모임 취소.",
      circle,
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ======== ked 새로운 모임 생성 post
circleRouter.post("/new/:userId", async (req, res) => {
  try {
    // 임시로 유저아이디 입력
    const { userId } = req.params;
    const coordinates = req.body.startLoc.coordinates; // 수정된 부분
    const endCoordinates = req.body.endLoc.endCoordinates; // 수정된 부분
    console.log("coordinates==========", coordinates);
    console.log("endCoordinates==========", endCoordinates);
    const circle = await new Circle({
      user: userId,
      name: req.body.name,
      text: req.body.text,
      startLoc: { coordinates },
      endLoc: { endCoordinates: endCoordinates },
      startTime: req.body.startTime,
      // startDate: req.body.startDate,
      usingTime: req.body.usingTime,
    }).save();
    console.log("()()()()())()", circle);
    const temp = {
      message: "모임 생성.",
    };
    return res.status(200).send({ temp, circle });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// CircleRouter.get("/:userid", async (req, res) => {
//   try {
//     const { userid } = req.params;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;

//     // 전체 모임리스트를 페이지네이션해 조회
//     const allCircles = await WorkingCircle.find()
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec();

//     // 유저가 포함된 모임 리스트를 조회
//     const userCircles = await WorkingCircle.find({ UserId: userid }).exec();

//     const temp = {
//       message:
//         "모든 써클 리스트를 조회한다. 이때 유저가 포함된 모임은 따로 분류한다. pageination에 대한 고민이 필요",
//       allCircles: allCircles,
//       userCircles: userCircles,
//       currentPage: page, // 현재페이지 번호 page: default 1
//       totalPages: Math.ceil((await WorkingCircle.countDocuments()) / limit),
//     };
//     return res.status(200).send(temp);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// // 모임 상세 정보 get
// CircleRouter.get("/detail/:circleid", async (req, res) => {
//   try {
//     // 모임정보 찾기
//     const { circleid } = req.params;

//     // 해당하는 모임정보
//     const circle = await WorkingCircle.findById(circleid);

//     if (!circle) {
//       return res.status(404).json({ message: "모임을 찾을 수 없습니다." });
//     }

//     const temp = {
//       message: "해당 써클의 상세한 정보를 얻는다.",
//       circle: circle,
//     };
//     return res.status(200).send(temp);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// // 모임정보 수정
// CircleRouter.put("/:circleid", async (req, res) => {
//   try {
//     const { circleid } = req.params;
//     const updatedCircle = {
//       // 모임정보 수정
//       title: req.body.title,
//       content: req.body.content,
//       start_loc: req.body.startPoint,
//       end_loc: req.body.endPoint,
//       startDate: req.body.startDate,
//       startTime: req.body.startTime,
//       usingTime: req.body.usingTime,
//       max: req.body.max,
//     };

//     // circleid의 모임을 updatedCircle객체로 수정 후 수정된 문서를 반환 , runValidators를통해 스키마 유효성 검사
//     const result = await WorkingCircle.findByIdAndUpdate(
//       circleid,
//       updatedCircle,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     // 수정결과가 없는경우 메시지 반환
//     if (!result) {
//       return Res.status(404).json({ message: "모임을 찾을 수 없습니다." });
//     }

//     const temp = {
//       message: "모임 정보 수정.",
//       updatedCircle,
//     };
//     return res.status(200).send(temp);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// // 모임 삭제
// CircleRouter.delete("/:circleid", async (req, res) => {
//   try {
//     const { circleid } = req.params;

//     const deleteCircle = await WorkingCircle.findByIdAndDelete(circleid); // 모임정보 삭제

//     if (!deleteCircle) {
//       return res.status(404).send({ message: "모임을 찾을 수 없습니다." });
//     }

//     const temp = {
//       message: "모임 정보 삭제.",
//       deleteCircle,
//     };
//     return res.status(200).send(temp);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// CircleRouter.post("/:circleid/join", async (req, res) => {
//   try {
//     const { circleid } = req.params;
//     const { userid } = req.body;

//     // 모임 정보 찾기
//     const circle = await WorkingCircle.findById(circleid);

//     if (!circle) {
//       return res.status(404).send({ message: "모임을 찾을 수 없습니다." });
//     }

//     // 유저가 이미 모임에 참석했는지 확인
//     if (circle.UserId.includes(userid)) {
//       return res.status(400).send({ message: "이미 모임에 참석했습니다." });
//     }

//     // 유저 추가
//     circle.UserId.push(userid);

//     // 현재 참석자 수 업데이트
//     circle.now = circle.UserId.length;

//     // 변경 사항 저장
//     await circle.save();

//     const temp = {
//       message: "모임 참석.",
//       circle,
//     };
//     return res.status(200).send(temp);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// CircleRouter.post("/:circleid/cancel", async (req, res) => {
//   try {
//     const { circleid } = req.params;
//     const { userid } = req.body;

//     // 모임 정보 찾기
//     const circle = await WorkingCircle.findById(circleid);
//     if (!circle) {
//       return res.status(404).send({ message: "모임을 찾을 수 없습니다." });
//     }

//     // 유저가 모임에 참석했는지 확인
//     const userIndex = circle.UserId.indexOf(userid);
//     if (userIndex === -1) {
//       return res
//         .status(400)
//         .send({ message: "유저가 모임에 참석하지 않았습니다." });
//     }

//     // 유저 제거
//     circle.UserId.splice(userIndex, 1);

//     // 현재 참석자 수 업데이트
//     circle.now = circle.UserId.length;

//     // 변경 사항 저장
//     await circle.save();

//     const temp = {
//       message: "모임 취소.",
//       circle,
//     };
//     return res.status(200).send(temp);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// // 새로운 모임 생성 post
// CircleRouter.post("/new", async (req, res) => {
//   try {
//     // const workingCircle = await new WorkingCircle(req.body).save();
//     // console.log(workingCircle);

//     const workingCircle = await new WorkingCircle({
//       title: req.body.title,
//       content: req.body.content,
//       start_loc: req.body.startPoint,
//       end_loc: req.body.endPoint,
//       startDate: req.body.startDate,
//       startTime: req.body.startTime,
//       usingTime: req.body.usingTime,
//       max: req.body.max,
//     }).save();

//     const temp = {
//       message: "모임 생성.",
//       workingCircle,
//     };
//     return res.status(200).send(temp);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// // CircleRouter.post("/new/check", async (req, res) => {
// //   try {
// //     const temp = {
// //       message: "모임 중복조회.",
// //     };
// //     return res.status(200).send(temp);
// //   } catch (error) {
// //     res.status(500).send(error.message);
// //   }
// // });

module.exports = circleRouter;
