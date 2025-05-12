const Chat = require('../../schemas/chat/chat.schema');
const promisePool = require('../../config/mysql.config');
const { createError } = require('../../utils/error');

class ChatService {
  async checkRoomExist(roomId) {
    const sql = `SELECT id FROM chat_rooms WHERE room_id = ?`;
    try {
      const [[room]] = await promisePool.query(sql, [roomId]);
      return !!room;
    } catch (error) {
      throw createError(500, `[DB에러 ChatService.findRoom] ${error.message}`);
    }
  }

  async addRoom(roomId) {
    const sql = `
      INSERT INTO
        chat_rooms
        (room_id)
      VALUES
        (?)
    `;
    try {
      await promisePool.query(sql, [roomId]);
    } catch (error) {
      throw createError(500, `[DB에러 ChatService.addRoom] ${error.message}`);
    }
  }

  async addMessages({ roomId, messages }) {
    const sql = `
      INSERT INTO
        chat_messages
        (chat_room_id, from_user_id, to_user_id, message, created_at)
      VALUES
        ${messages.map(() => '(?, ?, ?, ?, ?)').join(', ')}
    `;
    const values = messages.flatMap(({ content, from, to, createdAt }) => [
      roomId,
      from,
      to,
      content,
      createdAt,
    ]);
    try {
      await promisePool.query(sql, values);
    } catch (error) {
      throw createError(
        500,
        `[DB에러] ChatService.addMessages ${error.message}`,
      );
    }
  }

  async findChatByRoomId(roomId) {
    const sql = `
      SELECT 
        c.chat_room_id,
        c.message,
        c.created_at,
        fu.id AS from_user_id,
        fu.nickname AS from_nickname,
        fu.profileImage AS from_profile_image,

        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', p.id,
              'name', p.name,
              'age', p.age,
              'breed', p.breed,
              'image', p.image
            )
          )
          FROM
            pets p
          WHERE p.user_id = fu.id
        ) AS from_pets,

        tu.id AS to_user_id,
        tu.nickname AS to_nickname,
        tu.profileImage AS to_profile_image,

        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', p.id,
              'name', p.name,
              'age', p.age,
              'breed', p.breed,
              'image', p.image
            )
          )
          FROM
            pets p
          WHERE p.user_id = tu.id
        ) AS to_pets
      FROM 
        chat_messages c
      JOIN 
        users fu ON c.from_user_id = fu.id
      JOIN 
        users tu ON c.to_user_id = tu.id
      WHERE
        chat_room_id = ?
      ORDER BY 
        created_at ASC
    `;
    try {
      const [chatRows] = await promisePool.query(sql, [roomId]);
      const chats = chatRows.map(
        ({
          message,
          from_user_id,
          from_nickname,
          from_profile_image,
          from_pets,
          to_user_id,
          to_nickname,
          to_profile_image,
          to_pets,
        }) => ({
          content: message,
          from: {
            id: from_user_id,
            nickname: from_nickname,
            profileImage: from_profile_image,
            pets: from_pets ?? [],
          },
          to: {
            id: to_user_id,
            nickname: to_nickname,
            profileImage: to_profile_image,
            pets: to_pets ?? [],
          },
        }),
      );
      return chats;
    } catch (error) {
      throw createError(
        500,
        `[DB에러] ChatService.findChatByRoomId ${error.message}`,
      );
    }
  }
}

module.exports = new ChatService();
