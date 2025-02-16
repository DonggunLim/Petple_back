const CommentService = require('../../service/comment/comment.service');
const PostService = require('../../service/post/post.service');
const { createError } = require('../../utils/error');

class PostController {
  async getPosts(req, res, next) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    try {
      const [posts, totalPostsCount] = await PostService.getPosts(page, limit);
      const totalPage = Math.ceil(totalPostsCount / limit);
      const pageInfo = {
        totalPage,
        currentPage: page,
        nextPage: page + 1 > totalPage ? null : page + 1,
        prevPage: page - 1 === 0 ? page : page - 1,
      };
      return res.status(200).json({ success: true, pageInfo, posts });
    } catch (error) {
      next(error);
    }
  }

  async getPost(req, res, next) {
    const { id } = req.params;
    if (!id) {
      return next(createError(400, '게시글 정보가 필요합니다.'));
    }
    try {
      const post = await PostService.getPostById(id);
      return res.status(200).json({ success: true, post });
    } catch (error) {
      next(createError(500, `게시글을 가져오는데 실패하였습니다. ${error}`));
    }
  }

  async addPost(req, res, next) {
    const { _id: userId } = req.user;
    const { tags, images, description } = req.body;
    try {
      await PostService.createPost(tags, images, description, userId);
      return res
        .status(201)
        .json({ success: true, message: '게시글 작성에 성공하였습니다.' });
    } catch (error) {
      next(error);
    }
  }

  async updatePost(req, res, next) {
    const { id } = req.params;
    const post = req.body;
    const { _id: requestUserId } = req.user;
    if (!id) {
      return next(createError(400, '게시글 정보가 필요합니다.'));
    }
    try {
      const { creator } = await PostService.getPostById(id);
      if (creator._id.toString() !== requestUserId.toString()) {
        return next(createError(401, '게시글 수정 권한이 없습니다.'));
      }
      await PostService.updatePostById(id, post);
      return res
        .status(200)
        .json({ success: true, message: '게시글 업데이트 성공' });
    } catch (error) {
      next(createError(500, `게시글 업데이트에 실패하였습니다. ${error}`));
    }
  }

  async deletePost(req, res, next) {
    const { id } = req.params;
    const post = req.body;
    const { _id: requestUserId } = req.user;
    if (!id) {
      return next(createError(400, '게시글 정보가 필요합니다.'));
    }
    try {
      const { creator } = await PostService.getPostById(id);
      if (creator._id.toString() !== requestUserId.toString()) {
        return next(createError(401, '게시글 삭제 권한이 없습니다.'));
      }
      await PostService.deletePostById(id, post);
      return res
        .status(200)
        .json({ success: true, message: '게시글 삭제 성공' });
    } catch (error) {
      next(createError(500, `게시글 업데이트에 실패하였습니다. ${error}`));
    }
  }

  async deleteComment(req, res, next) {
    const { postId, commentId } = req.params;
    if (!postId || !commentId) {
      return next(createError(400, '데이터 정보가 부족합니다.'));
    }
    try {
      await PostService.deleteComment(postId, commentId);
      await CommentService.deleteComment(commentId);
      return res
        .status(200)
        .json({ success: true, message: '댓글 정보를 삭제하였습니다.' });
    } catch (error) {
      next(error);
    }
  }

  async updatePostLikesField(req, res, next) {
    const { id: postId } = req.params;
    const user = req.user;
    const { likeStatus } = req.body;
    if (!postId || likeStatus === undefined) {
      return next(createError(400, '업데이트에 필요한 정보가 부족합니다.'));
    }
    try {
      await PostService.updatePostLikesField(postId, user._id, likeStatus);
      return res
        .status(200)
        .json({ success: true, message: '게시글 정보를 수정하였습니다.' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();
