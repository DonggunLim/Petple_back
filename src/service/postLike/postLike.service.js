const promisePool = require('../../config/mysql.config');
const { createError } = require('../../utils/error');

class PostLikeService {
  async addLike({ userId, postId }) {
    const sql = `
        INSERT INTO
            post_likes
            (user_id, post_id)
        VALUES
            (?, ?)
    `;
    try {
      await promisePool.query(sql, [userId, postId]);
    } catch (error) {
      throw createError(
        500,
        `[DB 에러 PostLikeService.addLike] ${error.message}`,
      );
    }
  }
  async removeLike({ userId, postId }) {
    const sql = `
        DELETE FROM
            post_likes
        WHERE
            user_id = ? AND post_id = ?
    `;
    try {
      await promisePool.query(sql, [userId, postId]);
    } catch (error) {
      throw createError(
        500,
        `[DB 에러 PostLikeService.removeLike] ${error.message}`,
      );
    }
  }
}

module.exports = new PostLikeService();
