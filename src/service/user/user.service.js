const config = require('../../consts/app');
const { createError, AppError } = require('../../utils/error');
const posts = require('../../schemas/post/post.schema');
const pets = require('../../schemas/pet/pet.schema');
const users = require('../../schemas/user/user.schema');

const promisePool = require('../../config/mysql.config');

class UserService {
  async createUser({ name, email, nickName, profileImage, provider }) {
    const sql = `INSERT INTO users 
    (name, email, nickname, profileImage, provider)
    VALUES
    (?, ?, ?, ?, ?)
    `;
    const values = [name, email, nickName, profileImage, provider];

    try {
      const result = await promisePool.query(sql, values);
      return result[0].inserId;
    } catch (error) {
      throw Error('유저생성 실패' + error.message);
    }
  }

  async updateUser(email, { nickname, profileImage, jibunAddress, lng, lat }) {
    const sql = `UPDATE users
      SET 
        nickname = ?,
        profileImage = ?,
        jibun_address = ?,
        location_coordinates_lat = ?,
        location_coordinates_lng = ?
      WHERE email = ?
    `;
    const values = [nickname, profileImage, jibunAddress, lat, lng, email];
    try {
      await promisePool.query(sql, values);
    } catch (error) {
      throw Error('유저 정보 업데이트 실패' + error.message);
    }
  }

  async createPet({ name, age, breed, image, userId }) {
    const sql = `
      INSERT INTO pets
        (name, age, breed, image, user_id)
      VALUES
        (?, ?, ?, ?, ?)
    `;
    const values = [name, age, breed, image, userId];
    try {
      await promisePool.query(sql, values);
    } catch (error) {
      throw createError(500, '[DB에러] UserService.createPet');
    }
  }

  async updatePet(petId, { name, age, breed, image }) {
    const sql = `
      UPDATE pets
      SET 
        name = ?,
        age = ?,
        breed = ?,
        image = ?
      WHERE id = ?
    `;
    const values = [name, age, breed, image, petId];
    try {
      await promisePool.query(sql, values);
    } catch (error) {
      throw Error('유저 펫 정보 업데이트 실패' + error.message);
    }
  }

  async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const petSql = 'SELECT * FROM pets WHERE user_id = ?';
    const values = [email];
    try {
      const [userRow] = await promisePool.query(sql, values);
      if (!userRow.length) {
        return null;
      }
      const user = userRow[0];
      const [petRows] = await promisePool.query(petSql, [user.id]);
      return { ...user, pets: petRows };
    } catch (error) {
      throw createError(500, '[DB 에러] UserService.findByEmail');
    }
  }

  async findById(userId) {
    const sql = `
      SELECT * FROM users WHERE id = ?
    `;
    try {
      const [userRow] = await promisePool.query(sql, [userId]);
      return userRow[0];
    } catch (error) {
      throw createError(500, '[DB에러] UserService.findById');
    }
  }

  async findByKakaoId(kakaoId) {
    const sql = `SELECT * FROM users WHERE kakaoId = ?`;
    try {
      const [userRow] = await promisePool.query(sql, [kakaoId]);
      return userRow[0];
    } catch (error) {
      throw createError(500, '[DB에러] UserService.findByKakaoId');
    }
  }

  async duplication(userNickname) {
    const sql = `SELECT * FROM users WHERE nickname = ?`;
    try {
      const [userRow] = await promisePool.query(sql, [userNickname]);
      const isExistedNickname = !!userRow[0]?.nickname;
      if (isExistedNickname) {
        return false;
      }
      return true;
    } catch (error) {
      throw createError(500, `[DB에러] UserService.duplication`);
    }
  }

  async createNickname(userName) {
    try {
      const randomEmotion =
        config.emotion[Math.floor(Math.random() * config.emotion.length)];
      const randomNum = Math.floor(Math.random() * 9000 + 1);

      const randomNickname = `${randomEmotion}${userName}${randomNum}`;

      const checkNickname = await this.duplication(randomNickname);

      if (checkNickname) {
        return randomNickname;
      }
      return await createNickname(userName);
    } catch (error) {
      throw Error('랜덤닉네임 생성 실패' + error.message);
    }
  }

  async createEmail() {
    try {
      const randomString = Math.random().toString(36).slice(2);

      const randomEmail = `${randomString}@elice.com`;

      const sql = `SELECT email FROM users WHERE email = ?`;

      const [row] = await promisePool.query(sql, [randomEmail]);
      const existingEmail = row[0]?.email;

      if (!existingEmail) {
        return randomEmail;
      }

      return await createEmail();
    } catch (error) {
      throw Error(400, '랜덤 이메일 생성 실패');
    }
  }

  async findUsersByLocation(lng, lat) {
    const sql = `
      SELECT 
        u.id,
        u.name,
        u.nickname,
        u.email,
        u.profileImage,
        u.jibun_address,
        u.profileImage,
        u.location_coordinates_lat,
        u.location_coordinates_lng,
        u.created_at,
        u.updated_at,
        p.id AS petId,
        p.name AS petName,
        p.age AS petAge,
        p.breed AS petBreed,
        p.image AS petImage
      FROM users u
      LEFT JOIN pets p ON u.id = p.user_id
      WHERE 
        ST_Distance_Sphere(
          POINT(location_coordinates_lng, location_coordinates_lat),
          POINT(?, ?)
        ) <= 3000 
    `;
    const userMap = new Map();
    try {
      const [userRows] = await promisePool.query(sql, [lng, lat]);
      for (const row of userRows) {
        const userId = row.id;
        const { petName, petAge, petBreed, petImage, petId, ...rest } = row;

        if (!userMap.has(userId)) {
          userMap.set(userId, {
            ...rest,
            pets: [],
          });
        }
        userMap.get(userId).pets.push({
          name: petName,
          age: petAge,
          breed: petBreed,
          image: petImage,
        });
      }
      const users = [...userMap.values()];
      return users;
    } catch (error) {
      throw createError(500, '[DB에러 UserService.findByUsersByLocation]');
    }
  }

  async userPost(userId, page, pageSize) {
    const offset = (page - 1) * pageSize;
    const sql = `
      SELECT * FROM posts p
      JOIN users u ON p.creator_id = u.id
      WHERE p.creator_id = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const countSql = `
      SELECT COUNT(*) AS total
      FROM posts
      WHERE creator_id = ?
    `;
    try {
      const [posts] = await promisePool.query(sql, [userId, pageSize, offset]);
      const [[{ total }]] = await promisePool.query(countSql, [userId]);

      const totalPages = Math.ceil(total / pageSize);
      return { posts, totalPages };
    } catch (error) {
      throw createError(500, `[DB에러 UserService.userPost] ${error.message}`);
    }
  }

  async likePost(userId, page, pageSize) {
    const offset = (page - 1) * pageSize;
    const sql = `SELECT * FROM posts p
      JOIN post_likes pl ON p.id = pl.post_id
      WHERE pl.user_id = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const countSql = `
      SELECT COUNT(*) AS total
      FROM post_likes
      WHERE user_id = ?
    `;

    try {
      const [posts] = await promisePool.query(sql, [userId, pageSize, offset]);
      const [[{ total }]] = await promisePool.query(countSql, [userId]);
      const totalPages = Math.ceil(total / pageSize);
      return { posts, totalPages };
    } catch (error) {
      throw createError(500, `[DB에러 UserService.likePost] ${error.message}`);
    }
  }

  async findUserByNickname(nickname) {
    const sql = `
    SELECT 
      u.id, 
      u.name, 
      u.nickname, 
      u.profileImage, 
      (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', p.id,
            'name', p.name,
            'breed', p.breed,
            'image', p.image
          )
        ) 
        FROM 
          pets p
        WHERE 
          p.user_id = u.id
      ) AS pets
    FROM 
      users u
    WHERE 
      nickname = ?
    `;
    const values = [nickname];
    try {
      const [[user]] = await promisePool.query(sql, values);
      return {
        ...user,
        pets: user.pets ?? [],
      };
    } catch (error) {
      throw createError(
        500,
        `[DB에러 UserService.findUserByNickname] ${error.message}`,
      );
    }
  }
}

module.exports = new UserService();
