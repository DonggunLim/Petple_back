const ChatController = require('../../controllers/chat/chat.controller');
const withAuth = require('../../middleware/withAuth.middleware');

const chatRoutes = require('express').Router();

chatRoutes.get(
  '/messages/:targetUserNickname',
  withAuth,
  ChatController.getMessages,
);

module.exports = chatRoutes;
