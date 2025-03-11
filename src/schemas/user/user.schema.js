const mongoose = require('mongoose');
const {
  getCoordinates,
} = require('../../controllers/openApi/kakao.controller');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    nickName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String,
      required: false,
    },
    userPet: [
      {
        type: ObjectId,
        required: false,
        ref: 'pets',
      },
    ],
    address: {
      jibunAddress: { type: String, default: '' },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
          required: true,
        },
        coordinates: {
          type: [Number],
          default: [0, 0],
        },
      },
    },
    provider: {
      type: String,
      enum: ['google', 'kakao', 'naver'],
      required: true,
    },
    kakaoId: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('users', userSchema);
