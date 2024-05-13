import React from 'react';
const express = require("express");
const PetRouter = express.Router();

PetRouter.get("/list/:userid", async (req, res) => {
    try {
        let {userid} = req.params;
        const temp = {
            message : "마이펫이지-나의 펫리스트얻기."
        }
        return res.status(200).send(temp);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

PetRouter.put("/:petid", async (req, res) => {
    try {
        let {petid} = req.params;
        const temp = {
            message : "마이펫이지-펫 정보 수정하기."
        }
        return res.status(200).send(temp);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

PetRouter.post("/modimg/:petid", async (req, res) => {
    try {
        let {petid} = req.params;
        const temp = {
            message : "펫이미지수정"
        }
        return res.status(200).send(temp);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

PetRouter.delete("/:petid", async (req, res) => {
    try {
        let {petid} = req.params;
        const temp = {
            message : "펫정보삭제"
        }
        return res.status(200).send(temp);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

PetRouter.post("/:userid", async (req, res) => {
    try {
        let {petid} = req.params;
        const temp = {
            message : "펫추가하기"
        }
        return res.status(200).send(temp);
    } catch (error) {
        res.status(500).send(error.message);
    }
});





module.exports = PetRouter;

