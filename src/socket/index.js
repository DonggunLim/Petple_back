const { Server } = require('socket.io');

class SocketConfig {
  constructor() {
    this.io = null;
  }

  init(server) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    console.log('Socket.io init');
    return this.io;
  }
}

module.exports = new SocketConfig();
