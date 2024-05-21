const express = require("express");
const IndexRouter = express.Router();
const User = require("../models/User");

IndexRouter.get("/:userid", async (req, res) => {
    try {
        let {userid} = req.params;
        // let now_loc =
        // let user_loc = new Location()
        // const user = await User.findOne(userid).then(
        //     user_loc = user.loc
        // )

        const temp = {
            message : "유저주변 이용자들찾기~ && 모임찾기"
        }
        return res.status(200).send({temp});
    } catch (error) {
        console.log(error);
    }
});

module.exports = IndexRouter;



// 로직->













