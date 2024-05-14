const express = require("express");
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");

// 라우터선언
const appealRouter = require("./routers/appealRouter")
const circleRouter = require("./routers/circleRouter")
const indexRouter = require("./routers/indexRouter")
const petRouter = require("./routers/petRouter")
const userRouter = require("./routers/userRouter")

app.use(cors());
app.use("/uploads", express.static("uploads"));

dotenv.config();

const server = async function () {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("====데이터베이스_연결완료====");
    mongoose.set("debug", true);
    app.use(express.json());
  } catch (error) {
    console.log("====!!데이터베이스_연결실패!!====");
  }
  try{
    app.use("/appeal", appealRouter);
    app.use("/circles", circleRouter);
    app.use("/index", indexRouter);
    app.use("/pet", petRouter);
    app.use("/user", userRouter);

    app.listen(4000);
  }  catch (error){
    console.log("===서버open실패===")
  }
};

server();
