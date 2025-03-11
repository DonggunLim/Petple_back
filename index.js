const config = require('./src/consts/app');
const http = require('http');
const app = require('./app');
const SocketConfig = require('./src/socket/index');
const ChatNamespace = require('./src/socket/chat.socket');
const server = http.createServer(app);

const io = SocketConfig.init(server);
ChatNamespace(io);

server.listen(config.app.port, () =>
  console.log(`Express Running on ${config.app.port}`),
);
