import React from 'react';
const express = require("express");
const AppealRouter = express.Router();

AppealRouter.get("/:petid", async (req, res) => {
    try {
        const temp = {
            message : "자랑글 불러오기 -> 이때 댓글도 불러와야함."
        }
        return res.status(200).send(temp);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

AppealRouter.post("/:petid", async (req, res) => {
    try {
        const {petid} = req.params;
        const temp = {
            message : "게시글작성"
        }
        return res.status(200).send(temp);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

AppealRouter.post("/:petid/comment", async (req, res) => {
    try {
        const {petid} = req.params;
        const temp = {
            message : "댓글작성."
        }
        return res.status(200).send(temp);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = AppealRouter;