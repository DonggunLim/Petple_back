const alarmRoutes = require('express').Router();
const AlarmController = require('../../controllers/alarm/alarm.controller');
const withAuth = require('../../middleware/withAuth.middleware');

alarmRoutes.get('/connect', withAuth, AlarmController.connectAlarm);
alarmRoutes.get('/', withAuth, AlarmController.getAlarms);
alarmRoutes.patch('/:id', withAuth, AlarmController.updateAlarmRead);
alarmRoutes.delete('/:id', withAuth, AlarmController.deleteAlarms);

module.exports = alarmRoutes;
