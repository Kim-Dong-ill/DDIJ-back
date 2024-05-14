const express = require("express");
const IndexRouter = express.Router();

IndexRouter.get("/:userid", async (req, res) => {
    try {
        let {userid} = req.params;
        const temp = {
            message : "유저주변 이용자들찾기~ && 모임찾기"
        }
        return res.status(200).send({temp});
    } catch (error) {
        console.log(error);
    }
});

module.exports = IndexRouter;