const express = require("express");
const UserRouter = express.Router();
const { hash, compare } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
  try {
    const temp = {
      message: "register_post.",
    };
    return res.status(200).send(temp);
  } catch (error) {
    res.status(500).send(error.message);
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
