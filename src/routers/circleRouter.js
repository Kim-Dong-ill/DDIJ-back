const express = require("express");
const Pet = require("../models/Pet");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const CircleLocation = require("../models/CircleLocation");
const WorkingCircle = require("../models/WorkingCircle");
const circleRouter = express.Router();
const Circle = require("../models/Circle");

// 새로운 모임 생성 post
circleRouter.post("/new/:userId", async (req, res) => {
  try {
    // 임시로 유저아이디 입력
    const { userId } = req.params;
    // const coordinates = req.body.coordinates;
    // console.log("coordinates", coordinates);
    const circle = await new Circle({
      user: userId,
      name: req.body.name,
      text: req.body.text,
      // startLoc: { coordinates },
      endLoc: req.body.endLoc,
      startTime: req.body.startTime,
      startDate: req.body.startDate,
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
