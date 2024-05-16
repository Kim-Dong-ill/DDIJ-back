const express = require("express");
const UserRouter = express.Router();
const { hash, compare } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Pet = require("../models/Pet");
const { default: mongoose } = require("mongoose");

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
  try {
    const temp = {
      message: "login_post.",
    };
    return res.status(200).send(temp);
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

UserRouter.get("/auth", async (req, res) => {
  try {
    const temp = {
      message: "auth_get.",
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

UserRouter.post("/register", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const options = { session };
    const temp = {
      message: "register_post.",
    };
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      nickName: req.body.nickName,
      password: req.body.password,
      adress: req.body.adress,
    });
    const pet = new Pet({
      pName: req.body.pName,
      // image:
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
    // await Promise.all([user.save(), pet.save()]);

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

UserRouter.get("/:userid", async (req, res) => {
  try {
    let { userid } = req.params;

    const temp = {
      message: "search_user.",
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

UserRouter.put("/:userid/update", async (req, res) => {
  try {
    let { userid } = req.params;

    const temp = {
      message: "update_user.",
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

UserRouter.delete("/signout/:userid", async (req, res) => {
  try {
    let { userid } = req.params;

    const temp = {
      message: "delete_user.",
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = UserRouter;
