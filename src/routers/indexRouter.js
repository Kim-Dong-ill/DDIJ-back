const express = require("express");
const User = require("../models/User");
const Pet = require("../models/Pet");
const Circle = require("../models/Circle");
const IndexRouter = express.Router();

IndexRouter.get("/:userid", async (req, res) => {
  try {
    let { userid } = req.params;
    const temp = {
      message: "유저주변 이용자들찾기~ && 모임찾기",
    };
    return res.status(200).send({ temp });
  } catch (error) {
    console.log(error);
  }
});

IndexRouter.post("/geolocation", async (req, res) => {
  try {
    const { lat, lon } = req.body;
    console.log("aaaaaaaaaaaaaa", lat, lon);

    const circles = await Circle.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lon), parseFloat(lat)], // 경도, 위도 순서
          },
          distanceField: "distance",
          maxDistance: 5000, // 최대 거리 (미터 단위, 여기서는 2km) 2000
          spherical: true,
        },
      },
    ]);
    // if (circles.length === 0) {
    //   return res.status(404).json({ error: "해당 위치에 모임이 없습니다." });
    // }
    console.log("******************", circles);
    return res.status(200).send({ circles });
  } catch (error) {
    console.error("데이터 조회 중 오류:", error);
    return res.status(500).json({ error: "데이터 조회 중 오류 발생" });
  }
});

IndexRouter.post("/location", async (req, res) => {
  try {
    const { lat, lon } = req.body;
    console.log("!!!!!!!!!!!!!!!!!!", lat, lon);

    const users = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lon), parseFloat(lat)], // 경도, 위도 순서
          },
          distanceField: "distance",
          maxDistance: 5000, // 최대 거리 (미터 단위, 여기서는 2km) 2000
          spherical: true,
        },
      },
    ]);
    if (users.length === 0) {
      return res.status(404).json({ error: "해당 위치에 사용자가 없습니다." });
    }

    // 모든 사용자에 대한 펫 데이터를 조회하고 index가 1인 펫만 필터링
    const pets = await Promise.all(
      users.map(async (user) => {
        const userPets = await Pet.find({ user: user._id });
        return userPets.filter((pet) => pet.index === 1);
      })
    );

    // 2차원 배열로 반환된 pets를 1차원 배열로 변환
    const filteredPets = pets.flat();

    // console.log("------------", filteredPets);

    return res.status(200).json({ users, filteredPets });
  } catch (error) {
    console.error("데이터 조회 중 오류:", error);
    return res.status(500).json({ error: "데이터 조회 중 오류 발생" });
  }
});

module.exports = IndexRouter;
