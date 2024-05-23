const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      maxLength: 50,
    },
    nickName: {
      type: String,
      required: true,
      maxLength: 10,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      // 0-> 관리자, 1-> 사용자 .....
      type: Number,
      default: 1,
    },
    address: {
      type: String,
      required: true,
    },
  },
//[pet]있는게 좋을거같음
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", UserSchema);
module.exports = User;
