const ChatService = require('../service/chat/chat.service');
const AlarmController = require('../controllers/alarm/alarm.controller');

const mapRoomToUsers = new Map();
const mapRoomToMessages = new Map();

const ChatNamespace = (io) => {
  const chatNamespace = io.of('/chat');

  chatNamespace.on('connection', (socket) => {
    const { userId, nickname } = socket.handshake.query;

    socket.on('join_room', async (room) => {
      socket.join(room);
      socket.room = room;

      // 방이 없다면 만들기
      if (!mapRoomToUsers.get(room)) {
        mapRoomToUsers.set(room, []);
      }
      // 방에 유저 추가
      mapRoomToUsers.get(room).push({ userId, nickname, socketId: socket.id });

      // 데이터베이스에 저장되지않은 room messages
      const unSavedMessages = mapRoomToMessages.get(room);

      // 데이터베이스에 저장되지않은 메시지가 있다면 전송
      if (unSavedMessages) {
        socket.emit(
          'prev_message',
          unSavedMessages.map(({ originalData }) => ({
            content: originalData.content,
            from: originalData.from,
            to: originalData.to,
          })),
        );
      }
    });

    socket.on('send_message', async ({ roomId, content, from, to }) => {
      const message = {
        content,
        from: from.id,
        to: to.id,
        createdAt: new Date(),
        originalData: { content, from, to },
      };

      // room에 메시지 배열이 없다면 만들기
      if (!mapRoomToMessages.get(roomId)) {
        mapRoomToMessages.set(roomId, []);
      }

      // 배열에 메시지 추가
      mapRoomToMessages.get(roomId).push(message);

      // 방에 메시지 전송
      chatNamespace.to(roomId).emit('receive_message', { content, from, to });

      // 알림 전송
      // 방에 참여한 유저가없는 경우에만 알림 전송
      // if (mapRoomToUsers.get(roomId).every((user) => user.userId !== to.id)) {
      //   AlarmController.sendAlarm({
      //     uid: Date.now(),
      //     userId: to.id,
      //     type: 'chat',
      //     content: text,
      //     from: {
      //       nickName: from.nickName,
      //       id: from.id,
      //       profileImage: from.profileImage,
      //     },
      //     isRead: false,
      //   });
      // }

      // 메시지 배열이 10개 이상이면 DB 저장
      if (mapRoomToMessages.get(roomId).length === 10) {
        saveMessages(roomId, mapRoomToMessages.get(roomId));
      }
    });

    socket.on('disconnect', async () => {
      // 연결이 끊어진 유저 정보를 방에서 삭제
      const updatedUsers = mapRoomToUsers
        .get(socket.room)
        ?.filter((user) => user.socketId !== socket.id);
      mapRoomToUsers.set(socket.room, updatedUsers);

      const currentRoomUsersCount = mapRoomToUsers.get(socket.room)?.length;
      const unSavedMessages = mapRoomToMessages.get(socket.room);

      // 방에 유저가 없고 데이터베이스에 저장되지않은 메시지가 있다면 DB 저장
      if (currentRoomUsersCount === 0 && unSavedMessages) {
        saveMessages(socket.room, unSavedMessages);
      }
    });
  });

  const saveMessages = async (roomId, unSavedMessages) => {
    // 방에 메시지가 있을때에만 방을 DB에저장
    // 방 존재 여부 체크
    const roomExist = await ChatService.checkRoomExist(roomId);
    // 없다면 추가
    if (!roomExist) {
      await ChatService.addRoom(roomId);
    }
    await ChatService.addMessages({
      roomId,
      messages: unSavedMessages,
    });

    mapRoomToMessages.set(roomId, []);
  };
};

module.exports = ChatNamespace;
