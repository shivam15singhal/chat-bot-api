const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { Parser } = require('json2csv');

// Create a new conversation
const createConversation = async (req, res) => {
  try {
    const newConversation = await Conversation.create({
      userId: req.user.id,
    });
    res.status(201).json(newConversation);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all conversations of the logged-in user with latest message preview
const getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.id })
      .populate({
        path: 'messages',
        options: { sort: { timestamp: -1 }, limit: 1 } // show only latest message
      })
      .sort({ startedAt: -1 }); // sort by most recent conversation

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific conversation by ID
const getConversationById = async (req, res) => {
  try {
    const convo = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate('messages');

    if (!convo) return res.status(404).json({ message: 'Conversation not found' });

    res.status(200).json(convo);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Export conversations as JSON or CSV
const exportConversations = async (req, res) => {
  const { format = 'json' } = req.query;
  const userId = req.user.id;

  try {
    const conversations = await Conversation.find({ userId })
      .populate({
        path: 'messages',
        select: 'content sender timestamp -_id'
      });

    const data = conversations.map(convo => ({
      conversationId: convo._id,
      createdAt: convo.createdAt,
      messageCount: convo.messages.length,
      messages: convo.messages
    }));

    if (format === 'csv') {
      const flatData = data.flatMap(convo =>
        convo.messages.map(msg => ({
          conversationId: convo.conversationId,
          createdAt: convo.createdAt,
          content: msg.content,
          sender: msg.sender,
          timestamp: msg.timestamp
        }))
      );

      const csvParser = new Parser();
      const csv = csvParser.parse(flatData);

      res.header('Content-Type', 'text/csv');
      res.attachment('conversations.csv');
      return res.send(csv);
    }

    // Default to JSON
    res.header('Content-Type', 'application/json');
    res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to export conversations' });
  }
};

module.exports = {
  createConversation,
  getAllConversations,
  getConversationById,
  exportConversations
};
