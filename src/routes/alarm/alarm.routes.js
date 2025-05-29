const alarmRoutes = require('express').Router();
const AlarmController = require('../../controllers/alarm/alarm.controller');
const { token } = require('../../middleware/withAuth.middleware');

alarmRoutes.get('/connect', token, AlarmController.connectAlarm);
alarmRoutes.get('/', token, AlarmController.getAlarms);
alarmRoutes.patch('/:id', token, AlarmController.updateAlarmRead);
alarmRoutes.delete('/:id', token, AlarmController.deleteAlarms);

module.exports = alarmRoutes;
