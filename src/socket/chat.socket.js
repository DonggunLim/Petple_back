const ChatService = require('../service/chat/chat.service');

const ChatNamespace = (io) => {
  const chatNamespace = io.of('/chat');
  const mapRoomIdToMessages = {};
  const mapSocketIdToRoomId = {};

  chatNamespace.on('connection', (socket) => {
    const socketId = socket.id;

    socket.on('join_room', async (roomId) => {
      socket.join(roomId);
      mapSocketIdToRoomId[socketId] = roomId; // 연결된 소켓유저가 join한 roomId
      const unSavedMessages = mapRoomIdToMessages[roomId]; // 데이터베이스에 저장되지않은 roomId messages

      if (unSavedMessages) {
        socket.emit(
          'prev_message',
          unSavedMessages.map(({ originalData }) => ({
            text: originalData.text,
            from: originalData.from,
            to: originalData.to,
          })),
        );
      }
    });

    socket.on('send_message', async ({ roomId, text, from, to }) => {
      const message = {
        text,
        from: from.id,
        to: to.id,
        createdAt: new Date(),
        originalData: { text, from, to },
      };
      if (!mapRoomIdToMessages[roomId]) {
        mapRoomIdToMessages[roomId] = [];
      }
      mapRoomIdToMessages[roomId].push(message);

      chatNamespace.to(roomId).emit('receive_message', { text, from, to });

      if (mapRoomIdToMessages[roomId].length === 10) {
        console.log(mapRoomIdToMessages[roomId]);
        saveMessages(roomId, mapRoomIdToMessages[roomId]);
      }
    });

    socket.on('disconnect', async () => {
      const roomId = mapSocketIdToRoomId[socketId];
      const unSavedMessages = mapRoomIdToMessages[roomId];

      if (!roomId || !unSavedMessages) {
        return;
      }

      saveMessages(roomId, unSavedMessages);
      delete mapSocketIdToRoomId[socketId];
    });
  });

  const saveMessages = async (roomId, unSavedMessages) => {
    await ChatService.addMessageToChat({
      roomId,
      messages: unSavedMessages,
    });

    delete mapRoomIdToMessages[roomId];
  };
};

module.exports = ChatNamespace;
