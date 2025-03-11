const CommentService = require('../../service/comment/comment.service');
const PostService = require('../../service/post/post.service');
const { createError } = require('../../utils/error');

class CommentController {
  async addComment(req, res, next) {
    const { _id: creator } = req.user;
    const { postId, description, hasParent } = req.body;
    if (
      !postId ||
      !description ||
      hasParent === null ||
      hasParent === undefined
    ) {
      throw createError(400, '댓글 작성에 필요한 정보가 필요합니다.');
    }
    try {
      const isExistedPost = await PostService.getPostById(postId);
      if (!isExistedPost) {
        throw createError(404, '게시글을 찾을 수 없습니다.');
      }
      const comment = await CommentService.addComment(
        creator,
        postId,
        description,
        hasParent,
      );
      await PostService.updatePostCommentsField(postId, comment._id);
      return res.status(201).json({ success: true, comment });
    } catch (error) {
      next(error);
    }
  }

  async updateComment(req, res, next) {
    const { id } = req.params;
    const { description, postId } = req.body;
    try {
      if (!id) {
        throw createError(400, '댓글 정보가 필요합니다.');
      }
      const isExistedPost = await PostService.getPostById(postId);
      if (!isExistedPost) {
        throw createError(404, '게시물 정보가 없습니다.');
      }
      await CommentService.updateComment(id, description);
      return res
        .status(200)
        .json({ success: true, message: '댓글을 수정 하였습니다.' });
    } catch (error) {
      next(error);
    }
  }

  async addReply(req, res, next) {
    const user = req.user;
    const { targetCommentId, description, tag } = req.body;
    try {
      await CommentService.addReply(targetCommentId, {
        _id: user._id,
        name: user.name,
        nickName: user.nickName,
        profileImage: user.profileImage,
        email: user.email,
        description,
        tag,
      });
      return res.status(201).json({ success: true, message: '답글 성공' });
    } catch (error) {
      next(error);
    }
  }

  async deleteReply(req, res, next) {
    const { commentId, replyId } = req.params;
    if (!commentId || !replyId) {
      throw createError(400, '댓글 정보가 필요합니다.');
    }
    try {
      const isExistedComment = await CommentService.getCommentById(commentId);
      if (!isExistedComment) {
        throw createError(404, '댓글 정보가 없습니다.');
      }
      await CommentService.deleteReply(commentId, replyId);
      return res
        .status(204)
        .json({ success: true, message: '답글을 살제 하였습니다.' });
    } catch (error) {
      next(error);
    }
  }

  async updateReply(req, res, next) {
    const { commentId, replyId } = req.params;
    const { description } = req.body;
    if (!commentId || !replyId || !description) {
      throw createError(400, '댓글 정보가 필요합니다.');
    }
    try {
      const isExistedComment = await CommentService.getCommentById(commentId);
      if (!isExistedComment) {
        throw createError(404, '댓글 정보가 없습니다.');
      }
      await CommentService.updateReply(commentId, replyId, description);
      return res
        .status(200)
        .json({ success: true, message: '답글을 살제 하였습니다.' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommentController();
