const mongoose = require('mongoose');
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
      required: true,
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
    userType: {
      type: String,
      required: true,
      enum: ['local', 'google'],
      default: 'local',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('users', userSchema);
