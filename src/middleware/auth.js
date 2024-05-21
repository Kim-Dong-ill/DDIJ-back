const jwt = require("jsonwebtoken");
const User = require("../models/User");

let auth = async (req, res, next) => {
  //next는 middleware끼리 이동할때 끝나면 다음 next로 이동가능
  const authHeader = req.headers["authorization"]; //토큰 가져오기 Bearer 으로 가져온다.
  const token = authHeader && authHeader.split(" ")[1]; //띄어쓰기 기준으로 배열로 나눠줌 그중 1번쨰 가져온다.
  // A && start = A 가 있으면 start 실행
  // A || start = A 가 없으면 start 실행
  if (token === null) return res.sendStatus(401);

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY); //토큰 복호화해서 userId등등 뽑아낼거임
    const user = await User.findOne({ _id: decode.userId });

    if (!user) {
      return res.status(400).send("없는 유저입니다.");
    }
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
