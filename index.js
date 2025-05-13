const config = require('./src/consts/app');
const http = require('http');
const app = require('./app');
const SocketConfig = require('./src/socket/index');
const ChatNamespace = require('./src/socket/chat.socket');
const server = http.createServer(app);
const schedule = require('node-schedule');
const AlarmService = require('./src/service/alram/alram.service');

// Socket 설정
const io = SocketConfig.init(server);
ChatNamespace(io);

server.listen(config.app.port, () => {
  console.log(`Express Server Running on ${config.app.port}`);

  schedule.scheduleJob('0 0 * * *', () => {
    console.log(`delete expired alarms ${new Date()}`);
    AlarmService.deleteExpiredAlarms();
  });
});
