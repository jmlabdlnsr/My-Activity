const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, activityController.getActivities);
router.post('/', authenticateToken, activityController.createActivity);
router.put('/:id', authenticateToken, activityController.updateActivity);
router.delete('/:id', authenticateToken, activityController.deleteActivity);

module.exports = router;
