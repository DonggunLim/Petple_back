const Comment = require('../../schemas/comment/comment.schema');
const { createError } = require('../../utils/error');
const promisePool = require('../../config/mysql.config');

class CommentService {
  async addComment(user_id, post_id, parent_id, content) {
    const sql = `
      INSERT INTO
        comments
        (user_id, post_id, parent_id, content)
      VALUES
        (?, ?, ?, ?)
    `;
    try {
      const [commentRow] = await promisePool.query(sql, [
        user_id,
        post_id,
        parent_id ?? null,
        content,
      ]);
      return commentRow.insertId;
    } catch (error) {
      throw createError(`[DB에러] CommentService.addComment ${error.message}`);
    }
  }

  async deleteComment(id) {
    const sql = `
      DELETE FROM
        comments
      WHERE id = ?
    `;
    try {
      await promisePool.query(sql, [id]);
    } catch (error) {
      throw createError(
        500,
        `[DB에러] CommentService.deleteComment ${error.message}`,
      );
    }
  }

  async updateComment(id, content) {
    const sql = `
      UPDATE 
        comments
      SET
        content = ?
      WHERE
        id = ?
    `;
    try {
      await promisePool.query(sql, [content, id]);
    } catch (error) {
      throw new Error(`[DB에러] CommentService.updateComment ${error.message}`);
    }
  }
}

module.exports = new CommentService();
