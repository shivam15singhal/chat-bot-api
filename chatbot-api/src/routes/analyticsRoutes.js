const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const authenticateUser = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware'); // ensure this exists

// Only admins can access analytics
router.get('/', authenticateUser, authorizeRoles('admin'), getAnalytics);

module.exports = router;
