const Alarms = require('../../schemas/alarm/alarm.schema');
const { createError } = require('../../utils/error');
const promisePool = require('../../config/mysql.config');

class AlarmService {
  async getAlarms(userId) {
    const sql = `
      SELECT
        a.id,
        a.content,
        a.is_read,
        a.type,
        a.created_at,
        u.nickname,
        u.profileImage
      FROM
        alarms a
      JOIN
        users u ON a.from_user_id = u.id
      WHERE
        to_user_id = ?
    `;
    try {
      const [alarmRows] = await promisePool.query(sql, [userId]);
      const alarms = alarmRows.map(({ nickname, profileImage, ...rest }) => ({
        ...rest,
        from: {
          nickname,
          profileImage,
        },
      }));
      return alarms;
    } catch (error) {
      createError(500, `[DB에러 AlarmService.getAlarms] ${error.message}`);
    }
  }

  async addAlarm({ type, content, to, from }) {
    const expired_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    const sql = `
      INSERT INTO
        alarms
        (to_user_id, from_user_id, content, type, expired_at)
      VALUES
        (?, ?, ?, ?, ?)
    `;
    const selectSql = `
      SELECT 
        created_at
      FROM
        alarms
      WHERE
        id = LAST_INSERT)ID()
    `;
    try {
      await promisePool.query(sql, [to.id, from.id, content, type, expired_at]);
      const [[{ created_at }]] = await promisePool.query(selectSql);
      return created_at;
      return;
    } catch (error) {
      createError(500, `[DB에러 AlarmService.saveAlarms] ${error.message}`);
    }
  }

  async updateAlarmRead(id) {
    const sql = `
      UPDATE
        alarms
      SET
        is_read = 1
      WHERE
        id = ?
    `;
    try {
      await promisePool.query(sql, [id]);
    } catch (error) {
      createError(
        500,
        `[DB에러 AlarmService.updateAlarmRead] ${error.message}`,
      );
    }
  }

  async deleteAlarms(id) {
    const sql = `
      DELETE FROM
        alarms
      WHERE
        id = ?
    `;
    try {
      await promisePool.query(sql, [id]);
    } catch (error) {
      createError(500, `[DB에러 AlarmService.deleteAlarms] ${error.message}`);
    }
  }

  async deleteExpiredAlarms() {
    const sql = `
      DELETE FROM
        alarms
      WHERE
        expired_at < ?
    `;
    try {
      await promisePool.query(sql, [new Date()]);
    } catch (error) {
      createError(
        500,
        `[DB에러 AlarmService.deleteExpiredAlarms] ${error.message}`,
      );
    }
  }
}

module.exports = new AlarmService();
