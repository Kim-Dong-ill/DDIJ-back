const { default: mongoose } = require("mongoose");
const Pet = require("./Pet")
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
        location: {
            type: {
                type: String,
                enum: ["Point"], // 위치 타입은 'Point'로 제한
                default: "Point", // GeoJSON 타입은 기본적으로 'Point'로 설정
            },
            coordinates: {
                type: [Number], // 경도와 위도를 순서대로 배열로 저장 (GeoJSON 형식)
                index: "2dsphere", // GeoJSON 인덱스 생성 (지리적 위치 검색을 위해)
            }
        },
        mainPet:{
            type: mongoose.Types.ObjectId,
            ref: "Pet"
        },
        pets:[{
            type: mongoose.Types.ObjectId,
            ref: "Pet"
        }],  //index라우터 호환때문에 냅둠 수정후 삭제해야함
    },

    {
        timestamps: true,
    }
);

const User = mongoose.model("user", UserSchema);
module.exports = User;