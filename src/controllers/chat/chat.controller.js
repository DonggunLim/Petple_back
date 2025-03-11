const { findUserByNickname } = require('../../service/user/user.service');
const { createError } = require('../../utils/error');
const ChatService = require('../../service/chat/chat.service');

class ChatController {
  async getMessages(req, res, next) {
    const { targetUserNickname } = req.params;
    const user = req.user;
    try {
      if (!targetUserNickname) {
        throw createError(400, '유저 정보가 필요합니다.');
      }

      const targetUser = await findUserByNickname(targetUserNickname);
      if (!targetUser) {
        throw createError(404, '잘못 된 유저 정보 요청 입니다.');
      }
      const roomId = [targetUser._id, user._id].sort().join('-');
      const chat = await ChatService.findChatByRoomId(roomId);

      return res.status(200).json({ isSuccess: true, targetUser, chat });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChatController();
