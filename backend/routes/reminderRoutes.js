const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, reminderController.getReminders);
router.post('/', authenticateToken, reminderController.createReminder);
router.put('/:id', authenticateToken, reminderController.updateReminder);
router.delete('/:id', authenticateToken, reminderController.deleteReminder);

module.exports = router;
