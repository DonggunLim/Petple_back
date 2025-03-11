const ChatController = require('../../controllers/chat/chat.controller');
const { token } = require('../../middleware/token.middleware');

const chatRoutes = require('express').Router();

chatRoutes.get(
  '/messages/:targetUserNickname',
  token,
  ChatController.getMessages,
);

module.exports = chatRoutes;
