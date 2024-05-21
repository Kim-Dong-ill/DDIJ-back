const express = require("express");
const UserRouter = express.Router();
const { hash, compare } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Pet = require("../models/Pet");
const { default: mongoose } = require("mongoose");
const auth = require("../middleware/auth");
const upload = require("../middleware/imageUploads");

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

UserRouter.post("/logout", async (req, res) => {
  try {
    const temp = {
      message: "logout_post.",
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

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

// image
UserRouter.post("/register/image", upload.single("image"), async (req, res) => {
  try {
    console.log(req.file.filename);
    return res.status(200).send(req.file.filename);
  } catch (error) {
    console.log(error);
  }
});

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

UserRouter.post("/chkvalue", async (req, res) => {
  try {
    const temp = {
      message: "checkVal_post.",
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

UserRouter.get("/:userId", async (req, res) => {
  try {
    let { userId } = req.params;
    console.log(userId);

    const myPet = await Pet.find({ user: userId });
    const temp = {
      message: "search_user.",
    };
    return res.status(200).send({ temp, myPet });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

UserRouter.put("/:userId/update", async (req, res) => {
  try {
    let { userId } = req.params;

    const temp = {
      message: "update_user.",
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

UserRouter.delete("/signout/:userId", async (req, res) => {
  try {
    let { userId } = req.params;

    const temp = {
      message: "delete_user.",
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = UserRouter;
