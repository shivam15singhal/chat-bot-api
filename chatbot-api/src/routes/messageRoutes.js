const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticateUser = require('../middleware/authMiddleware');

router.post('/', authenticateUser, messageController.addMessage);

router.get('/:conversationId', authenticateUser, messageController.getMessages);


router.put('/:id', authenticateUser, messageController.updateMessage);

router.delete('/:id', authenticateUser, messageController.deleteMessage);

router.get('/search/:conversationId', authenticateUser, messageController.searchMessages);

router.get('/search/:conversationId', authenticateUser, messageController.searchMessages);



module.exports = router;
