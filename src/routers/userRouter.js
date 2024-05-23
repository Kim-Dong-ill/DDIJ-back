const express = require("express");
const UserRouter = express.Router();
const { hash, compare } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Pet = require("../models/Pet");
const { default: mongoose } = require("mongoose");
const auth = require("../middleware/auth");
const upload = require("../middleware/imageUploads");
const path = require("path");
const fs = require("fs");
const AppealPost = require("../models/AppealPost");
const AppealComment = require("../models/AppealComment");

UserRouter.get("/", async (req, res) => {
  try {
    const temp = {
      message: "login_Router_살아있음.",
    };
    const user = await User.find({});
    return res.status(200).send({ user });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//로그인 start
UserRouter.post("/login", async (req, res) => {
  console.log("로그인");
  try {
    const temp = {
      message: "login_post.",
    };
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });
    console.log("user", user);
    if (!user) {
      return res
        .status(400)
        .send({ message: "입력하신 정보를 다시 확인해주세요." });
    }

    const isMatch = await compare(password, user.password);
    console.log("isMatch", isMatch);
    if (!isMatch) {
      return res
        .status(400)
        .send({ message: "입력하신 정보를 다시 확인해주세요." });
    }

    const payload = {
      userId: user._id.toHexString(),
      email: user.email,
      role: user.role,
    };
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    return res
      .status(200)
      .send({ temp, user, accessToken, message: "오늘도 놀아주개!!" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//로그아웃 start
UserRouter.post("/logout", async (req, res) => {
  try {
    const temp = {
      message: "logout_post.",
    };
    return res
      .status(200)
      .send({ temp, message: "😻😻 다음에 또 놀러오개!! 😻😻" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//auth인증 start
UserRouter.get("/auth", auth, async (req, res) => {
  try {
    // const temp = {
    //   message: "auth_get.",
    // };
    console.log(req.user);
    const user = {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      nickName: req.user.nickName,
      address: req.user.address,
      role: req.user.role,
      image: req.user.image,
    };
    // return res.status(200).send({ temp, user });
    return res.status(200).send({ user });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//반려견 이미지 파일삭제
UserRouter.delete("/register/image/:image", async (req, res) => {
  try {
    const { image } = req.params;
    const filePath = path.join(__dirname, "..", "..", "uploads", image);

    // 비동기 방식으로 파일 삭제
    await fs.promises.unlink(filePath);

    return res.status(200).send({ image });
  } catch (error) {
    console.log(error);
  }
});

// 반려견image 업로드
UserRouter.post("/register/image", upload.single("image"), async (req, res) => {
  try {
    console.log(req.file.filename);
    return res.status(200).send(req.file.filename);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error deleting file" });
  }
});

//회원가입
UserRouter.post("/register", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  console.log(req.body);
  try {
    // console.log(req.file.filename);
    const options = { session };
    const temp = {
      message: "register_post.",
    };

    const password = await hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      coords: req.body.coords,
      nickName: req.body.nickName,
      password,
      address: req.body.address,
    });
    const pet = new Pet({
      user: user._id,
      index: 1,
      pName: req.body.pName,
      image: req.body.image,
      pGender: req.body.pGender,
      pBreed: req.body.pBreed,
      pCharOne: req.body.pChar,
      pAge: req.body.pAge,
      vaccine: req.body.vaccine,
      neuter: req.body.neuter,
      rabies: req.body.rabies,
    });
    await user.save(options);
    await pet.save(options);
    // console.log("Pet saved", pet);

    // await Promise.all([user.save(options), pet.save(options)]);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).send({ temp, user, pet });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).send(error.message);
  }
});

//이메일 중복 체크
UserRouter.post("/checkemail", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.emailValue });
    if (user) {
      return res.send({ errorMsg: "사용중인 이메일입니다." });
    }
    return res.status(200).send({ message: "사용 가능한 이메일입니다." });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

//닉네임 중복체크
UserRouter.post("/checknickname", async (req, res) => {
  try {
    const temp = {
      message: "checkVal_post.",
    };

    console.log(req.body.nickValue); //checkNick:qqq
    const user = await User.findOne({ nickName: req.body.nickValue });
    console.log(user);
    if (user) {
      return res.send({ errorMsg: "사용중인 닉네임입니다.", nickState: false });
    }
    return res
      .status(200)
      .send({ temp, message: "사용 가능한 닉네임입니다.", nickState: true });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

//axios안쓰고 유저 정보 가져올 수 있어서 사용 안함
// UserRouter.get("/:userId", async (req, res) => {
//   try {
//     let { userId } = req.params;
//     if (!mongoose.isValidObjectId(userId)) {
//       return res.status(400).send({ error: "유저가 없습니다." });
//     }
//     const user = await User.findOne({ _id: userId });
//     if (!user) {
//       return res.status(400).send({ message: "유저가 없습니다." });
//     }
//     const temp = {
//       message: "search_user.",
//     };
//     return res.status(200).send({ temp, user });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

//유저 수정
UserRouter.patch("/:userId/update", async (req, res) => {
  try {
    let { userId } = req.params;
    const temp = {
      message: "update_user.",
    };
    if (!req.body.password) {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            name: req.body.name,
            nickName: req.body.nickName,
            address: req.body.address,
            coords: req.body.coords,
          },
        },
        {
          new: true,
        }
      );
      console.log(user);
      return res.status(200).send({ temp, user });
    } else {
      const password = await hash(req.body.password, 10);
      const user = await User.findByIdAndUpdate(userId, {
        $set: {
          name: req.body.name,
          nickName: req.body.nickName,
          password,
          address: req.body.address,
          coords: req.body.coords,
        },
      });
      console.log(user);
      return res.status(200).send({ temp, user });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

UserRouter.delete("/signout/:userId", async (req, res) => {
  try {
    let { userId } = req.params;
    //나중에 Promis.all로 한번에
    const user = await User.findOne({ _id: userId }); //유저 삭제
    const pet = await Pet.find({ user: userId }); //반려견 삭제
    const post = await AppealPost.find({ user: userId }); //자랑하게글 삭제
    const postComment = await AppealComment.find({ user: userId }); //자랑하게 댓글 삭제
    //모임 댓글 삭제

    console.log(pet);
    const temp = {
      message: "delete_user.",
    };
    return res.status(200).send(temp);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

//유저 수정 비밀번호 확인
UserRouter.post("/checkpassword", async (req, res) => {
  try {
    const password = req.body.defaultP;
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .send({ message: "유저가 없습니다.", passwordState: false });
    }
    const isMatch = await compare(password, user.password);
    if (isMatch) {
      return res.send({ message: "일치합니다.", passwordState: true });
    }
    return res.send({ errMsg: "다시 입력해주세요.", passwordState: false });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = UserRouter;
