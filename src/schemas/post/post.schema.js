const mongoose = require('mongoose');
const { String, ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    creator: {
      type: ObjectId,
      required: true,
      ref: 'users',
    },
    tags: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
    comments: {
      type: [ObjectId],
      ref: 'comments',
      default: [],
    },
    likes: {
      type: [ObjectId],
      ref: 'users',
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  },
);

const Post = mongoose.model('posts', postSchema);
module.exports = Post;
