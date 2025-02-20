const Post = require('../../schemas/post/post.schema');
const { createError } = require('../../utils/error');

class PostService {
  async getPosts(page, limit) {
    const skip = (page - 1) * limit;
    try {
      const [posts, totalPostsCount] = await Promise.all([
        Post.find() //
          .sort({ createdAt: -1 })
          .populate('creator')
          .skip(skip)
          .limit(limit)
          .lean(),
        Post.countDocuments(),
      ]);
      return [posts, totalPostsCount];
    } catch (error) {
      throw new Error(`[DB에러] PostService.getPosts`, { cause: error });
    }
  }

  async getPopularPosts() {
    try {
      const documents = await Post.aggregate([
        {
          $addFields: { likesCount: { $size: '$likes' } },
        },
        {
          $sort: { likesCount: -1 },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'creator',
            foreignField: '_id',
            as: 'creator',
          },
        },
        {
          $unwind: '$creator',
        },
        {
          $limit: 10,
        },
      ]);
      return documents;
    } catch (error) {
      throw createError(500, '[DB에러 PostSerice.getPopularPosts]');
    }
  }

  async getPostById(postId) {
    try {
      const document = await Post.findById(postId)
        .populate('creator')
        .populate({
          path: 'comments',
          populate: { path: 'creator' },
        })
        .lean();
      return document;
    } catch (error) {
      throw new Error(`[DB에러] PostService.getPostById`, { cause: error });
    }
  }

  async createPost(tags, images, description, userId) {
    try {
      await Post.create({ creator: userId, tags, images, description });
    } catch (error) {
      throw new Error(`[DB에러] PostService.createPost`, { cause: error });
    }
  }

  async updatePostById(id, post) {
    try {
      await Post.findByIdAndUpdate(id, post);
    } catch (error) {
      throw new Error(`[DB에러 PostService.updatePostById]`, { cause: error });
    }
  }

  async updatePostCommentsField(id, commentId) {
    try {
      await Post.findByIdAndUpdate(id, {
        $push: { comments: commentId },
      });
    } catch (error) {
      throw new Error(`[DB에러] PostService.updatePostCommentsField`, {
        cause: error,
      });
    }
  }

  async updatePostLikesField(postId, userId, likeStatus) {
    const query = likeStatus
      ? { $push: { likes: userId } }
      : { $pull: { likes: userId } };
    try {
      await Post.findByIdAndUpdate(postId, query);
    } catch (error) {
      throw new Error(`[DB에러] PostService.updatePostLikesField`, {
        cause: error,
      });
    }
  }

  async deleteComment(postId, commentId) {
    try {
      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: commentId },
      });
    } catch (error) {
      throw new Error(`[DB에러] PostService.deleteComment`, {
        cause: error,
      });
    }
  }

  async deletePostById(id) {
    try {
      await Post.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`[DB에러 PostService.updatePostById]`, { cause: error });
    }
  }
}

module.exports = new PostService();
