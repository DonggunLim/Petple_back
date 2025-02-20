const Comment = require('../../schemas/comment/comment.schema');
const { createError } = require('../../utils/error');

class CommentService {
  async getCommentById(id) {
    try {
      const document = await Comment.findById(id).lean();
      return document;
    } catch (error) {
      throw createError(500, `[DB에러] CommentService.getCommentById`);
    }
  }

  async addComment(creator, post, description, hasParent) {
    try {
      const document = await Comment.create({
        creator,
        post,
        description,
        hasParent,
      });
      return document.toObject();
    } catch (error) {
      throw new Error(`[DB에러] CommentService.addComment`, { cause: error });
    }
  }

  async deleteComment(id) {
    try {
      await Comment.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`[DB에러] CommentService.deleteComment`, {
        cause: error,
      });
    }
  }

  async updateComment(id, description) {
    try {
      await Comment.findByIdAndUpdate(id, { description });
    } catch (error) {
      throw new Error(`[DB에러] CommentService.updateComment`, {
        cause: error,
      });
    }
  }

  async addReply(
    commentId,
    { _id: creatorId, name, nickname, profileImage, email, description, tag },
  ) {
    try {
      const document = await Comment.findByIdAndUpdate(commentId, {
        $push: {
          replies: {
            creatorId,
            name,
            nickname,
            profileImage,
            email,
            description,
            tag,
          },
        },
      }) //
        .lean();
      return document;
    } catch (error) {
      throw new Error(`[DB에러] CommentService.addReply`, { cause: error });
    }
  }

  async deleteReply(commentId, replyId) {
    try {
      await Comment.findByIdAndUpdate(commentId, {
        $pull: { replies: { _id: replyId } },
      });
    } catch (error) {
      throw new Error('[DB에러] CommentService.deleteReply', { cause: error });
    }
  }

  async updateReply(commentId, replyId, description) {
    try {
      await Comment.findOneAndUpdate(
        {
          _id: commentId,
          'replies._id': replyId,
        },
        {
          $set: {
            'replies.$.description': description,
          },
        },
      );
    } catch (error) {
      throw new Error('[DB에러] CommentService.updateReply', { cause: error });
    }
  }
}

module.exports = new CommentService();
