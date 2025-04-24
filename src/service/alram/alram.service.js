const Alarms = require('../../schemas/alarm/alarm.schema');
const { createError } = require('../../utils/error');

class AlarmService {
  async getAlarms(userId) {
    try {
      const alarms = await Alarms.find(
        { userId },
        '-_id -__v -updatedAt -userId',
      ) //
        .populate('from', 'nickName -_id')
        .lean();
      return alarms;
    } catch (error) {
      createError(500, '[DB에러 AlarmService.getAlarms]');
    }
  }

  async addAlarms(alarms) {
    try {
      const document = await Alarms.create(alarms); //
      return document;
    } catch (error) {
      createError(500, '[DB에러 AlarmService.saveAlarms]');
    }
  }

  async updatedAlarmRead(userId, uid) {
    try {
      await Alarms.updateOne({ userId, uid }, { isRead: true });
    } catch (error) {
      createError(500, '[DB에러 AlarmService.updatedAlarmRead]');
    }
  }

  async deleteAlarms(userId, uid) {
    try {
      await Alarms.deleteOne({ userId, uid });
    } catch (error) {
      createError(500, '[DB에러 AlarmService.deleteAlarms]');
    }
  }
}

module.exports = new AlarmService();
