const AlarmService = require('../../service/alram/alram.service');
const { createError } = require('../../utils/error');

const sseClients = new Map();

class AlarmController {
  connectAlarm(req, res) {
    const { id: userId } = req.user;
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
    const { id: userId } = req.user;
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
    const client = sseClients.get(alarm.to.id);
    const created_at = await AlarmService.addAlarm(alarm);
    const { to, ...rest } = alarm;
    const filterd = {
      ...rest,
      from: {
        nickname: alarm.from.nickname,
        profileImage: alarm.from.profileImage,
      },
      created_at,
    };
    if (client) {
      client.write(`data: ${JSON.stringify(filterd)}\n\n`);
    }
  }

  async updateAlarmRead(req, res, next) {
    const { id } = req.params;
    try {
      if (!id) {
        throw createError(400, '알림 정보가 필요합니다.');
      }
      await AlarmService.updateAlarmRead(id);
      return res
        .status(200)
        .json({ success: true, message: '알림 읽음 처리 성공' });
    } catch (error) {
      next(error);
    }
  }

  async deleteAlarms(req, res, next) {
    const { id } = req.params;
    try {
      if (!id) {
        throw createError(400, '알림 정보가 필요합니다.');
      }
      await AlarmService.deleteAlarms(id);
      return res.status(200).json({ success: true, message: '알림 삭제 성공' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AlarmController();
