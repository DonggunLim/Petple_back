const mongoose = require('mongoose');
const { ObjectId, String, Number } = mongoose.Schema.Types;

const alarmSchema = new mongoose.Schema(
  {
    uid: {
      type: Number,
      required: true,
    },
    userId: {
      type: ObjectId,
      required: true,
      ref: 'users',
    },
    type: {
      type: String,
      enum: ['chat'],
      required: true,
    },
    content: {
      type: String,
      required: false,
    },
    from: {
      type: ObjectId,
      required: true,
      ref: 'users',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('alarms', alarmSchema);
