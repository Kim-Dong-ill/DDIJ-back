import React from 'react';
const express = require("express");
const CircleRouter = express.Router();

CircleRouter.get("/:userid", async (req, res) => {
    try {
        let {userid} = req.params;

        const temp = {
            message : "모든 써클 리스트를 조회한다. 이때 유저가 포함된 모임은 따로 분류한다. pageination에 대한 고민이 필요"
        }
        return res.status(200).send(temp);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

CircleRouter.get("/detail/:circleid", async (req, res) => {
    try {
        let {circleid} = req.params;

        const temp = {
            message : "해당 써클의 상세한 정보를 얻는다."
        }
        return res.status(200).send(temp);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

CircleRouter.put("/:circleid", async (req, res) => {
    try {
        let {circleid} = req.params;

        const temp = {
            message : "모임 정보 수정."
        }
        return res.status(200).send(temp);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

CircleRouter.delete("/:circleid", async (req, res) => {
    try {
        let {circleid} = req.params;

        const temp = {
            message : "모임 정보 삭제."
        }
        return res.status(200).send(temp);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

CircleRouter.post("/:circleid/join", async (req, res) => {
    try {
        let {circleid} = req.params;

        const temp = {
            message : "모임 참석."
        }
        return res.status(200).send(temp);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

CircleRouter.post("/:circleid/cancel", async (req, res) => {
    try {
        let {circleid} = req.params;

        const temp = {
            message : "모임 취소."
        }
        return res.status(200).send(temp);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

CircleRouter.post("/new", async (req, res) => {
    try {
        const temp = {
            message : "모임 생성."
        }
        return res.status(200).send(temp);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

CircleRouter.post("/new/check", async (req, res) => {
    try {
        const temp = {
            message : "모임 중복조회."
        }
        return res.status(200).send(temp);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = CircleRouter;