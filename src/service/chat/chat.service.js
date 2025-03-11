const Chat = require('../../schemas/chat/chat.schema');
const { createError } = require('../../utils/error');

class ChatService {
  async addMessageToChat({ roomId, text, from, to }) {
    try {
      await Chat.findOneAndUpdate(
        { roomId },
        {
          $push: { messages: { text, from, to } },
        },
        { upsert: true },
      );
    } catch (error) {
      throw createError(500, `[DB에러] ChatService.addMessageToChat`);
    }
  }

  async findChatByRoomId(roomId) {
    try {
      const document = await Chat.findOne({ roomId }, 'roomId messages.text') //
        .populate({
          path: 'messages.from',
          select: 'name nickName profileImage',
          populate: { path: 'userPet', select: 'name image' },
        })
        .populate({
          path: 'messages.to',
          select: 'name nickName profileImage',
          populate: { path: 'userPet', select: 'name image' },
        })
        .lean();
      return document;
    } catch (error) {
      throw createError(500, `[DB에러] ChatService.findChatByRoomId`);
    }
  }
}

module.exports = new ChatService();
