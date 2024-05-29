const express = require("express");
const Pet = require("../models/Pet");                      //나중에 pet으로 변경
const User = require("../models/User");                    //나중에 user로 변경
const { default: mongoose } = require("mongoose");
const Circle = require("../models/Circle");
const CircleComment = require("../models/CircleComment");
const CircleRouter = express.Router();

function addFinishTime(circle){
  let circleObj = circle.toObject();
  console.log("시작시간:!!!!!!!!!!!!!!!!!!!!"+circle.startTime)
  circleObj.finishTime = new Date(circle.startTime.getTime() + (circle.usingTime.getTime()));
  return circleObj
}

function checkDone(circle){
  if(((circle.startTime).getTime() > Date.now())&& (circle.Users.length<circle.peoples)){
      if (circle.Users.length<0){
          circle.complete= true;
          console.log("인원에 오류가 있습니다.")
      }
      circle.nowUser = circle.Users.length
      circle.complete = false;
  }
  else{
      circle.nowUser = circle.Users.length
      circle.complete=true;
  }
  return circle
}
function preDate(circle) {
    if (circle.startTime) {
        const kstOffset = 9 * 60 * 60 * 1000
        const date = new Date(circle.startTime.getTime() -kstOffset); // Date 객체로 변환
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);

        const formattedDate = `${year}년 ${month}월 ${day}일`;
        const formattedTime = `${hours}시 ${minutes}분`;

        circle.DateData = formattedDate;
        circle.TimeData = formattedTime;
        return circle;
    } else {
        return false;
    }
}


// -> 그냥 모든 모임 리스틀 다 보여준다. // 이떄 자신이 참여중인 목록을 따로 넘겨받는다.
CircleRouter.get("/:userid", async (req, res) => {
    try {
        const { userid } = req.params;
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
            circle = addFinishTime(circle)
            circle = checkDone(circle)
              circle = preDate(circle)
            circle.mainPet=""
          }
          else{
              console.log("user조회가 실패")
              let EmptyCircleForHandleError = circle;
              EmptyCircleForHandleError = addFinishTime(EmptyCircleForHandleError)
              EmptyCircleForHandleError = checkDone(EmptyCircleForHandleError)
              return EmptyCircleForHandleError
          }
          return circle;
        })
    );
    let userCircles = await Circle.find({ Users: userid }).exec();
    let tempUserCircles =await Promise.all(
        userCircles.map(async (circle) => {
            circle = addFinishTime(circle)
            circle = checkDone(circle)
            circle = preDate(circle)
            circle.mainPet=""
        return circle
  })
);
    const temp = {
      allCircles: updatedCircles ,
      userCircles: tempUserCircles,
      currentPage: page, // 현재페이지 번호 page: default 1
      totalPages: Math.ceil((await Circle.countDocuments()) / limit),
    };

    return res.status(200).send(temp);
    //
  } catch (error) {
    console.log(error.message)
    res.status(500).send(error.message);
  }
});

// 유저의 좌표를 받아와 유저 근처에 있는모임 목록 ()개와, 시간순으로 뽑은 모임 ()개를 보내준다.
CircleRouter.post("/:userid", async (req, res) => {
  try {
    const calculateDistance = (coord1, coord2) => {
        try{
            const [lat1, lon1] = coord1;
            const [lat2, lon2] = coord2;

            const earthRadius = 6371e3;

            const lat1Rad = lat1 * Math.PI / 180;
            const lat2Rad = lat2 * Math.PI / 180;
            const deltaLatRad = (lat2 - lat1) * Math.PI / 180;
            const deltaLonRad = (lon2 - lon1) * Math.PI / 180;

            const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            const distance = earthRadius * c;

            return distance;
        }catch (e){
            console.log(e.message)
            return false
        }
    }

    const { userid } = req.params;
    const {userLocation} = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

        // 전체 모임리스트를 페이지네이션해 조회
        const preCircle = await Circle.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

      let allCircles = await Promise.all(
          preCircle.map(async (circle) => {
              if (circle.Users.length > 0) {
                  circle = addFinishTime(circle)
                  circle = checkDone(circle)
                  circle = preDate(circle)
                  circle.mainPet=""
              }
              return circle;
          })
      );

    let circlesByNear = [...allCircles].sort((a, b) => {
      const distA = calculateDistance(userLocation, a.startLoc.coordinates);
      const distB = calculateDistance(userLocation, b.startLoc.coordinates);
      return ((distA)-(distB)? distA-distB : 0)
    });

    let circlesByTime = [...allCircles].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    const userCircleByTime = circlesByTime.filter(circle => circle.Users.some(user => user.toString() === userid));

    const userCircleByDist = circlesByNear.filter(circle => circle.Users.some(user => user.toString() === userid));

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
    console.log(error.message)
    res.status(500).send(error.message);
  }
})

// 모임 상세 정보 get -> 선택한 모임의 상세 정보를 보여줘야 한다. => 보여줘야할 정보는 ()이다.
CircleRouter.get("/detail/:circleid", async (req, res) => {
  try {
    // 모임정보 찾기
    const { circleid } = req.params;
    // 해당하는 모임정보
    const circle = await Circle.findById(circleid);
    circleData = addFinishTime(circle)
    circleData = checkDone(circleData)
    console.log(circleData)

    if (!circle) {
      return res.status(404).json({ message: "모임을 찾을 수 없습니다." });
    }
    const user = await User.findById(circle.Users[0]).exec();

    if (!user) {
      return res.status(404).json({ message: "대표유저를 찾을 수 없습니다." });
    }

    const mainPet = await Pet.findById(user.mainPet).exec();
    if (!mainPet) {
      return res.status(404).json({ message: "대표 반려견을 찾을 수 없습니다." });
    }

    const temp = {
      message: "circle에 대한 상세정보, Start_Loc는 지도를 찍어주고, name, text, startTime등을 활용",
      circle: circleData,
      User : user,
      mainPet: mainPet
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 모임정보 수정 => 클라이언트로부터 자료를 받아와 db에 덮어쓴다.
CircleRouter.put("/:circleid", async (req, res) => {
  try {
    const { circleid } = req.params;
    const updatedCircle = {
      name: req.body.name,
      text: req.body.text,
        startAdd : req.body.startAdd,
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

        const result = await Circle.findByIdAndUpdate(
            circleid,
            updatedCircle,
            {
                new: true,
                runValidators: true,
            }
        );

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
CircleRouter.delete("/:circleid", async (req, res) => {
    try {
        const { circleid } = req.params;

        const deleteCircle = await Circle.findByIdAndDelete(circleid); // 모임정보 삭제

    if (!deleteCircle) {
      return res.status(404).send({ message: "모임을 찾을 수 없습니다." });
    }
    for (const userid of deleteCircle.Users) {
      await User.findByIdAndUpdate(userid, { $pull: { circles: circleid } });
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
CircleRouter.post("/:circleid/join", async (req, res) => {
    try {
        const { circleid } = req.params;
        const { userid } = req.body;

    // 모임 정보 찾기
    const circle = await Circle.findById(circleid);

        if (!circle) {
            return res.status(404).send({ message: "모임을 찾을 수 없습니다." });
        }

    if (circle.complete){
      return res.status(404).send({ message: "이미 완료된 모임입니다.." });
    }

    if((circle.Users).length>=5){
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
CircleRouter.post("/:circleid/cancel", async (req, res) => {
    try {
        const { circleid } = req.params;
        const { userid } = req.body;

        // 모임 정보 찾기
        const circle = await Circle.findById(circleid);
        if (!circle) {
            return res.status(404).send({ message: "모임을 찾을 수 없습니다." });
        }

        // 유저가 모임에 참석했는지 확인
        const userIndex = circle.userid.indexOf(userid);
        if (userIndex === -1) {
            return res
                .status(400)
                .send({ message: "유저가 모임에 참석하지 않았습니다." });
        }

        // 유저 제거
        circle.userid.splice(userIndex, 1);

        // 현재 참석자 수 업데이트
        circle.now = circle.userid.length;

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
      startAdd: req.body.startAdd,
      usingTime: req.body.usingTime,
      peoples: req.body.peoples,
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

// 모임 댓글 -Post
circleRouter.post("/:circleId/comment", async (req, res) => {
  try {
    const { content, circleId, userId } = req.body;

    const circleComment = await new CircleComment({
      circle: circleId,
      user: userId,
      content: content,
      createdAt: new Date(),
    }).save();

    return res.status(200).send({ circleComment });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 모임 댓글 - Get
circleRouter.get("/:circleId/comment", async (req, res) => {
  try {
    const { circleId } = req.params;
    const circleComment = await CircleComment.find({
      circle: circleId,
    })
      .populate([
        {
          path: "user",
          select: "nickName",
        },
      ])
      .sort({ createdAt: 1 });
    return res.status(200).send({ circleComment });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = circleRouter;

// 모임 댓글 - Post (Myfull식)
// circleRouter.post("/:circleId/comment", async (req, res) => {
//   try {
//     const { circleId } = req.params;
//     const { userId, content } = req.body;

//     console.log(circleId);
//     if (!mongoose.isValidObjectId(circleId))
//       return res.status(400).send({ message: "circleId 가 없습니다." });
//     if (!mongoose.isValidObjectId(userId))
//       return res.status(400).send({ message: "userId 가 없습니다." });
//     if (typeof content !== "string")
//       return res.status(400).send({ message: "" });

//     const [circle, user] = await Promise.all([
//       Circle.findById(circleId),
//       User.findById(userId),
//     ]);

//     const comment = await new CircleComment({
//       circle,
//       user,
//       content,
//     }).save();
//     return res.status(200).send({ comment });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// 모임 댓글 - Get (Myfull 식)
// circleRouter.get("/:circleId/comment", async (req, res) => {
//   try {
//     const { circleId } = req.params;
//     if (!mongoose.isValidObjectId(circleId))
//       return res.status(400).send({ message: "circleId 가 없음" });
//     const comment = await CircleComment.find({ circle: circleId }).sort({
//       createAt: 1,
//     });
//     return res.status(200).send({ comment });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// 이하 circleRouter였던것

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
//     const userCircles = await WorkingCircle.find({ userid: userid }).exec();

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
//     if (circle.userid.includes(userid)) {
//       return res.status(400).send({ message: "이미 모임에 참석했습니다." });
//     }

//     // 유저 추가
//     circle.userid.push(userid);

//     // 현재 참석자 수 업데이트
//     circle.now = circle.userid.length;

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
//     const userIndex = circle.userid.indexOf(userid);
//     if (userIndex === -1) {
//       return res
//         .status(400)
//         .send({ message: "유저가 모임에 참석하지 않았습니다." });
//     }

//     // 유저 제거
//     circle.userid.splice(userIndex, 1);

//     // 현재 참석자 수 업데이트
//     circle.now = circle.userid.length;

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


module.exports = CircleRouter;

