const alarmRoutes = require('express').Router();
const AlarmController = require('../../controllers/alarm/alarm.controller');
const { token } = require('../../middleware/token.middleware');

alarmRoutes.get('/connect', token, AlarmController.connectAlarm);
alarmRoutes.get('/', token, AlarmController.getAlarms);
alarmRoutes.patch('/', token, AlarmController.updatedAlarmRead);
alarmRoutes.delete('/', token, AlarmController.deleteAlarms);

module.exports = alarmRoutes;
