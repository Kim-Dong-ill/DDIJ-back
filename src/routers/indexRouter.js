const express = require("express");
const IndexRouter = express.Router();
const User = require("../models/userTEST");
const Circle =require("../models/circleTEST")

IndexRouter.post("/:userid", async (req, res) => {
    try {
        let {userid} = req.params;
        const {nowCoords}= req.body;
        console.log(nowCoords.longitude)
        const nearUser = await User.aggregate([
            {
                $geoNear:{
                    near:{
                        type: "Point",
                        coordinates: [parseFloat(nowCoords.longitude),parseFloat(nowCoords.latitude)]
                    },
                    distanceField: "distance",
                    maxDistance:30000,
                    spherical:true
                },
            },
        ])
        const nearCircle = await Circle.aggregate([
            {
                $geoNear:{
                    near:{
                        type: "Point",
                        coordinates: [parseFloat(nowCoords.longitude),parseFloat(nowCoords.latitude)]
                    },
                    distanceField: "distance",
                    maxDistance:30000,
                    spherical:true
                },
            },
        ])
        console.log(nearCircle)
        return res.status(200).json({nearUser,nearCircle})

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


// IndexRouter.post("/testinput", async (req,res)=>{
//     try {
//         const testUser = await new User({
//             name: req.body.name,
//             location: req.body.location
//         }).save()
//
//         return res.status(200).send({testUser})
//     }
//     catch(error){
//         res.status(500).send(error.message);
//     }
// })
// IndexRouter.post("/testcircleinput", async (req,res)=>{
//     try {
//         const testCircle = await new Circle({
//             name: req.body.name,
//             startLoc: req.body.startLoc
//         }).save()
//
//         return res.status(200).send({testCircle})
//     }
//     catch(error){
//         res.status(500).send(error.message);
//     }
// })
// IndexRouter.get("/testget", async (req,res)=>{
//     try{
//         const tempUserALl = await User.find()
//         const tempCircleAll = await Circle.find()
//         console.log({tempUserALl}+ {tempCircleAll})
//         return res.send(tempUserALl)
//     }
//     catch (error){
//         return res.status(500).send(error.message)
//     }
// })
module.exports = IndexRouter;



// 로직->













