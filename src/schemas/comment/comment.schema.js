const mongoose = require('mongoose');
const { String, ObjectId, Boolean } = mongoose.Schema.Types;

const commentSchema = new mongoose.Schema(
  {
    creator: {
      type: ObjectId,
      ref: 'users',
      required: true,
    },
    post: {
      type: ObjectId,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reply: {
      type: [
        {
          _id: {
            type: ObjectId,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          nickName: {
            type: String,
            required: true,
          },
          profileImage: {
            type: String,
            default: '',
          },
          email: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          tag: {
            type: String,
            default: null,
          },
          hasParent: {
            type: Boolean,
            default: true,
          },
        },
        {
          timestamps: true,
        },
      ],
      default: [],
    },
    hasParent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Comment = mongoose.model('comments', commentSchema);
module.exports = Comment;
