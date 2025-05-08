const Post = require('../../schemas/post/post.schema');
const { createError, AppError } = require('../../utils/error');
const promisePool = require('../../config/mysql.config');

class PostService {
  async getPosts(page, limit) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT
        p.id, 
        p.tags,
        p.images,
        p.description,
        p.created_at,
        p.updated_at,
        u.name,
        u.nickname,
        u.email,
        u.id AS userId,
        u.profileImage,
        COUNT(pl.user_id) AS likesCount,
        COUNT(c.id) AS commentsCount ,
        GROUP_CONCAT(pl.user_id) AS likedUserIds
      FROM 
        posts p
      JOIN 
        users u ON p.creator_id = u.id
      LEFT JOIN
        post_likes pl ON p.id = pl.post_id
      LEFT JOIN
        comments c ON p.id = c.post_id
      GROUP BY
        p.id
      ORDER BY 
        p.created_at DESC
      LIMIT ? OFFSET ? 
    `;
    const countSql = `SELECT COUNT(*) AS totalPostsCount FROM posts`;

    try {
      const [[postRows], [[{ totalPostsCount }]]] = await Promise.all([
        promisePool.query(sql, [limit, offset]),
        promisePool.query(countSql),
      ]);

      const posts = postRows.map(
        ({
          userId,
          name,
          nickname,
          email,
          profileImage,
          likedUserIds,
          ...rest
        }) => ({
          creator: {
            id: userId,
            name,
            nickname,
            email,
            profileImage,
          },
          likedUserIds: likedUserIds
            ? likedUserIds.split(',').map((id) => Number(id))
            : [],
          ...rest,
        }),
      );

      return [posts, totalPostsCount];
    } catch (error) {
      throw createError(500, `[DB에러] PostService.getPosts ${error.message}`);
    }
  }

  async getPopularPosts() {
    const sql = `
      SELECT 
        p.id,
        p.tags,
        p.images,
        p.description,
        p.created_at,
        u.id AS userId,
        u.name,
        u.nickname,
        u.email,
        u.profileImage,
        COUNT(pl.user_id) AS likesCount,
        COUNT(c.id) AS commentsCount 
      FROM posts p
      JOIN users u ON p.creator_id = u.id
      LEFT JOIN post_likes pl ON p.id = pl.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      GROUP BY p.id
      ORDER BY likesCount DESC
      LIMIT 10 
    `;
    try {
      const [postRow] = await promisePool.query(sql);
      const posts = postRow.map(
        ({ userId, name, nickname, email, profileImage, ...rest }) => ({
          creator: {
            id: userId,
            name,
            nickname,
            email,
            profileImage,
          },
          ...rest,
        }),
      );
      return posts;
    } catch (error) {
      throw createError(
        500,
        `[DB에러 PostSerice.getPopularPosts] ${error.message}`,
      );
    }
  }

  async getPostById(postId) {
    const postSql = `
      SELECT
        p.id, 
        p.tags, 
        p.images, 
        p.description,
        p.created_at, 
        u.id AS userId,
        u.email,
        u.name,
        u.nickname,
        u.profileImage,
        COUNT(pl.user_id) AS likesCount,
        COUNT(c.id) AS commentsCount,
        GROUP_CONCAT(pl.user_id) AS likedUserIds
      FROM 
        posts p
      JOIN 
        users u ON p.creator_id = u.id
      LEFT JOIN 
        post_likes pl ON p.id = pl.post_id
      LEFT JOIN
        comments c ON p.id = c.post_id
      WHERE 
        p.id = ?
      GROUP BY
        p.id
    `;
    const commentSql = `
      SELECT
        c.id,
        c.post_id,
        c.content,
        c.created_at,
        u.id AS userId,
        u.name,
        u.email,
        u.nickname,
        u.profileImage
      FROM 
        comments c
      JOIN 
        users u ON c.user_id = u.id
      WHERE
        c.post_id = ?
      ORDER BY
        c.created_at
    `;
    try {
      const [[post]] = await promisePool.query(postSql, [postId]);
      if (!post) {
        throw createError(404, '게시글 정보를 찾을 수 없습니다.');
      }
      const [commentRows] = await promisePool.query(commentSql, [postId]);
      const {
        userId,
        email,
        name,
        nickname,
        profileImage,
        likedUserIds,
        ...postRest
      } = post;
      const creator = { id: userId, email, name, nickname, profileImage };

      const comments = commentRows.map(
        ({ userId, name, email, nickname, profileImage, ...rest }) => ({
          creator: {
            id: userId,
            name,
            email,
            nickname,
            profileImage,
          },
          ...rest,
        }),
      );

      return {
        ...postRest,
        likedUserIds: likedUserIds
          ? likedUserIds.split(',').map((id) => Number(id))
          : [],
        creator,
        comments,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw createError(
        500,
        `[DB에러] PostService.getPostById ${error.message}`,
      );
    }
  }

  async createPost(tags, images, description, userId) {
    const sql = `
      INSERT INTO 
        posts
        (tags, images, description, creator_id)
      VALUES
        (?, ?, ?, ?)
    `;
    try {
      await promisePool.query(sql, [
        JSON.stringify(tags),
        JSON.stringify(images),
        description,
        userId,
      ]);
    } catch (error) {
      throw createError(`[DB에러] PostService.createPost ${error.message}`);
    }
  }

  async updatePostById({ id, description, images, tags }) {
    const sql = `
      UPDATE
        posts
      SET 
        description = ?,
        images = ?,
        tags = ?
      WHERE 
        posts.id = ?
    `;
    try {
      await promisePool.query(sql, [
        description,
        JSON.stringify(images),
        JSON.stringify(tags),
        id,
      ]);
    } catch (error) {
      throw createError(
        500,
        `[DB에러 PostService.updatePostById] ${error.message} `,
      );
    }
  }

  async deletePostById(id) {
    const sql = `
      DELETE
      FROM
        posts
      WHERE
        id = ?
    `;
    try {
      const [result] = await promisePool.query(sql, [id]);
      if (result.affectedRows === 0) {
        throw createError(404, '삭제할 게시글이 존재하지 않습니다.');
      }
    } catch (error) {
      throw createError(`[DB에러 PostService.deletePostById] ${error.message}`);
    }
  }
}

module.exports = new PostService();
