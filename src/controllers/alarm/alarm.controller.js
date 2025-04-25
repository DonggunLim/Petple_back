const AlarmService = require('../../service/alram/alram.service');
const { createError } = require('../../utils/error');

const sseClients = new Map();

class AlarmController {
  connectAlarm(req, res) {
    const { _id: userId } = req.user;
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    res.write('SSE connected \n\n');
    sseClients.set(userId.toString(), res);

    req.on('close', () => {
      sseClients.delete(userId.toString());
    });
  }

  async getAlarms(req, res, next) {
    const { _id: userId } = req.user;
    try {
      if (!userId) {
        throw createError(400, '유저 정보가 필요합니다.');
      }
      const alarms = await AlarmService.getAlarms(userId);
      return res.status(200).json({ success: true, alarms });
    } catch (error) {
      next(error);
    }
  }

  async sendAlarm(alarm) {
    const client = sseClients.get(alarm.userId);
    const document = await AlarmService.addAlarms({
      ...alarm,
      from: alarm.from.id,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });
    const { userId, ...rest } = alarm;
    const filterd = {
      ...rest,
      from: {
        nickName: alarm.from.nickName,
        profileImage: alarm.from.profileImage,
      },
      createdAt: document.createdAt,
    };
    if (client) {
      client.write(`data: ${JSON.stringify(filterd)}\n\n`);
    }
  }

  async updatedAlarmRead(req, res, next) {
    const { _id: userId } = req.user;
    const { uid } = req.query;
    try {
      if (!uid) {
        throw createError(400, '알림 정보가 필요합니다.');
      }
      await AlarmService.updatedAlarmRead(userId, uid);
      return res
        .status(200)
        .json({ success: true, message: '알림 읽음 처리 성공' });
    } catch (error) {
      next(error);
    }
  }

  async deleteAlarms(req, res, next) {
    const { _id: userId } = req.user;
    const { uid } = req.query;
    try {
      if (!uid) {
        throw createError(400, '알림 정보가 필요합니다.');
      }
      await AlarmService.deleteAlarms(userId, uid);
      return res.status(200).json({ success: true, message: '알림 삭제 성공' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AlarmController();
