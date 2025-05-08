const CommentService = require('../../service/comment/comment.service');
const PostService = require('../../service/post/post.service');
const { createError } = require('../../utils/error');

class CommentController {
  async addComment(req, res, next) {
    const { id: user_id } = req.user;
    const { postId, content, parentId } = req.body;
    if (!postId || !content) {
      throw createError(400, '댓글 작성에 필요한 정보가 필요합니다.');
    }
    try {
      await CommentService.addComment(user_id, postId, parentId, content);
      return res.status(201).json({ success: true, message: '댓글 작성 성공' });
    } catch (error) {
      next(error);
    }
  }

  async updateComment(req, res, next) {
    const { id } = req.params;
    const { content } = req.body;
    try {
      if (!id) {
        throw createError(400, '댓글 정보가 필요합니다.');
      }
      await CommentService.updateComment(id, content);
      return res
        .status(200)
        .json({ success: true, message: '댓글을 수정 하였습니다.' });
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req, res, next) {
    const { id } = req.params;
    try {
      if (!id) {
        throw createError(400, '댓글 정보가 필요합니다.');
      }
      await CommentService.deleteComment(id);
      return res
        .status(200)
        .json({ success: true, message: '댓글을 수정 하였습니다.' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommentController();
