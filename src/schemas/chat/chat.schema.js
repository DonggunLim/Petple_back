const mongoose = require('mongoose');
const { String, ObjectId } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    from: {
      type: ObjectId,
      required: true,
      ref: 'users',
    },
    to: {
      type: ObjectId,
      required: true,
      ref: 'users',
    },
  },
  {
    timestamps: true,
  },
);

const chatSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      requried: true,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Chat = mongoose.model('chats', chatSchema);
module.exports = Chat;
