const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalConversations = await Conversation.countDocuments();
    const totalMessages = await Message.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalConversations,
        totalMessages,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Analytics fetch failed', error: error.message });
  }
};

module.exports = {
  getAnalytics,
};
