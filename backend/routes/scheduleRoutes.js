const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, scheduleController.getSchedules);
router.post('/', authenticateToken, scheduleController.createSchedule);
router.put('/:id', authenticateToken, scheduleController.updateSchedule);
router.delete('/:id', authenticateToken, scheduleController.deleteSchedule);

module.exports = router;
