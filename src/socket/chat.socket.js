const ChatService = require('../service/chat/chat.service');

const ChatNamespace = (io) => {
  // const chatNamespace = io.of('/chat');

  io.on('connection', (socket) => {
    console.log('connection chat socket');
    socket.on('join_room', async (roomId) => {
      socket.join(roomId);
    });

    socket.on('send_message', async ({ roomId, text, from, to }) => {
      try {
        await ChatService.addMessageToChat({
          roomId,
          text,
          from: from.id,
          to: to.id,
        });
        io.to(roomId).emit('receive_message', { text, from, to });
      } catch (error) {
        io.to(roomId).emit('fail_add_message', { text, from, to });
      }
    });
  });
};

module.exports = ChatNamespace;
