const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
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
    maxLength: 50,
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

  createAt: Date,
});
const User = mongoose.model("user", UserSchema);
module.exports = User;
