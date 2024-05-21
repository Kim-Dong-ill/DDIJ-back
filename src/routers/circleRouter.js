const express = require("express");
const Pet = require("../models/Pet");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const CircleLocation = require("../models/CircleLocation");
const WorkingCircle = require("../models/WorkingCircle");
const CircleRouter = express.Router();

CircleRouter.get("/:userid", async (req, res) => {
  try {
    let { userid } = req.params;

    // let workingCircle = req.params;

    const temp = {
      message:
        "모든 써클 리스트를 조회한다. 이때 유저가 포함된 모임은 따로 분류한다. pageination에 대한 고민이 필요",
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 모임 상세 정보 get
CircleRouter.get("/detail/:circleid", async (req, res) => {
  try {
    // 모임정보 찾기
    const { circleid } = req.params;

    // 해당하는 모임정보
    const circle = await WorkingCircle.findById(circleid);

    if (!circle) {
      return res.status(404).json({ message: "모임을 찾을 수 없습니다." });
    }

    const temp = {
      message: "해당 써클의 상세한 정보를 얻는다.",
      circle: circle,
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 모임정보 수정
CircleRouter.put("/:circleid", async (req, res) => {
  try {
    const { circleid } = req.params;
    const updatedCircle = {
      // 모임정보 수정
      title: req.body.title,
      content: req.body.content,
      start_loc: req.body.startPoint,
      end_loc: req.body.endPoint,
      startTime: req.body.startTime,
      usingTime: req.body.usingTime,
      max: req.body.max,
    };

    // circleid의 모임을 updatedCircle객체로 수정 후 수정된 문서를 반환 , runValidators를통해 스키마 유효성 검사
    const result = await WorkingCircle.findByIdAndUpdate(
      circleid,
      updatedCircle,
      {
        new: true,
        runValidators: true,
      }
    );

    // 수정결과가 없는경우 메시지 반환
    if (!result) {
      return Res.status(404).json({ message: "모임을 찾을 수 없습니다." });
    }

    const temp = {
      message: "모임 정보 수정.",
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

CircleRouter.delete("/:circleid", async (req, res) => {
  try {
    let { circleid } = req.params;

    const temp = {
      message: "모임 정보 삭제.",
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

CircleRouter.post("/:circleid/join", async (req, res) => {
  try {
    let { circleid } = req.params;

    const temp = {
      message: "모임 참석.",
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

CircleRouter.post("/:circleid/cancel", async (req, res) => {
  try {
    let { circleid } = req.params;

    const temp = {
      message: "모임 취소.",
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 새로운 모임 생성 post
CircleRouter.post("/new", async (req, res) => {
  try {
    // const workingCircle = await new WorkingCircle(req.body).save();
    // console.log(workingCircle);

    const workingCircle = new WorkingCircle({
      title: req.body.title,
      content: req.body.content,
      start_loc: req.body.startPoint,
      end_loc: req.body.endPoint,
      startTime: req.body.startTime,
      usingTime: req.body.usingTime,
      max: req.body.max,
    }).save();

    const temp = {
      message: "모임 생성.",
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

CircleRouter.post("/new/check", async (req, res) => {
  try {
    const temp = {
      message: "모임 중복조회.",
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = CircleRouter;
