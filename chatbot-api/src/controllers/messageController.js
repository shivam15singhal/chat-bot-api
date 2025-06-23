const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// Add a message to a conversation
exports.addMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const sender = req.user.id;

    console.log("Received data:", { conversationId, content, sender });

    const message = new Message({ conversationId, sender, content });
    await message.save();

    // Push message ID to conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      $push: { messages: message._id }
    });

    // Emit socket event after saving message
    const io = req.app.get('io');
    io.to(conversationId).emit('newMessage', message);

    res.status(201).json(message);
  } catch (error) {
    console.error("Error in addMessage:", error); // 🔍 Log the real error
    res.status(500).json({ error: 'Failed to add message' });
  }
};

// Get all messages from a conversation (with pagination, sorting, and access check)
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 20, skip = 0, sort = 'timestamp' } = req.query;

    const convo = await Conversation.findOne({
      _id: conversationId,
      userId: req.user.id,
    });

    if (!convo) {
      return res.status(403).json({ error: 'Unauthorized to access this conversation' });
    }

    const messages = await Message.find({ conversationId })
      .sort(sort)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Update a message
exports.updateMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const { content } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to update this message' });
    }

    message.content = content;
    await message.save();

    res.status(200).json({ message: 'Message updated successfully', updatedMessage: message });
  } catch (error) {
    console.error("Error in updateMessage:", error);
    res.status(500).json({ error: 'Failed to update message' });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    console.log('Requester ID:', req.user._id);
    console.log('Message sender ID:', message.sender);

    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this message' });
    }

    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error("Error in deleteMessage:", error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

// Search messages in a conversation by keyword
exports.searchMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Missing search keyword' });
    }

    const convo = await Conversation.findOne({
      _id: conversationId,
      userId: req.user.id,
    });

    if (!convo) {
      return res.status(403).json({ error: 'Unauthorized to search this conversation' });
    }

    const messages = await Message.find({
      conversationId,
      content: { $regex: q, $options: 'i' },
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in searchMessages:", error);
    res.status(500).json({ error: 'Failed to search messages' });
  }
};
