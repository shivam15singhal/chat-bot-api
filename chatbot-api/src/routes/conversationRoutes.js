const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const conversationController = require('../controllers/conversationController');
const authorizeRole = require('../middleware/authorizeRole');

// Create a new conversation
router.post('/', authenticateUser, conversationController.createConversation);

// Get all conversations of authenticated user
router.get('/', authenticateUser, conversationController.getAllConversations);

// Export conversations (JSON or CSV)
router.get('/export', authenticateUser, conversationController.exportConversations);

// Get a specific conversation by ID
router.get('/:id', authenticateUser, conversationController.getConversationById);


// Export conversations (admin only)
router.get(
  '/export',
  authenticateUser,
  authorizeRole('admin'),
  conversationController.exportConversations
);

module.exports = router;
