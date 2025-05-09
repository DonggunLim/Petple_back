const PostLikeService = require('../../service/postLike/postLike.service');
const { createError } = require('../../utils/error');

class PostLikeController {
  async toggleLike(req, res, next) {
    const { id: postId } = req.params;
    const { id: userId } = req.user;
    const { likeStatus } = req.body;
    try {
      if (!postId || !userId) {
        throw createError(400, '업데이트 정보가 필요합니다.');
      }
      if (likeStatus) {
        await PostLikeService.addLike({ userId, postId });
      } else {
        await PostLikeService.removeLike({ userId, postId });
      }

      return res.status(200).json({
        success: true,
        message: likeStatus ? '좋아요 추가 완료' : '좋아요 삭제 완료',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostLikeController();
