const express = require('express');
const Message = require('../models/Message');
const Match = require('../models/Match');
const { authenticate, checkSubscription } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/messages/unread/count
// @desc    Get unread message count
// @access  Private
router.get('/unread/count', authenticate, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false,
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   GET /api/messages/:conversationId
// @desc    Get messages for a conversation
// @access  Private
router.get('/:conversationId', authenticate, checkSubscription, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 0, limit = 50 } = req.query;
    const skip = parseInt(page) * parseInt(limit);

    // Verify user is part of this conversation
    const match = await Match.findOne({
      conversationId,
      users: { $in: [req.user._id] },
    });

    if (!match) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const messages = await Message.find({ conversationId })
      .sort({ timestamp: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('sender', 'name photos')
      .populate('receiver', 'name');

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        receiver: req.user._id,
        isRead: false,
      },
      { isRead: true }
    );

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   POST /api/messages/:conversationId
// @desc    Send a message (REST fallback, prefer Socket.io)
// @access  Private
router.post('/:conversationId', authenticate, checkSubscription, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, receiverId } = req.body;

    if (!content || !receiverId) {
      return res.status(400).json({ message: 'Content and receiver are required.' });
    }

    // Verify match exists
    const match = await Match.findOne({
      conversationId,
      users: { $all: [req.user._id, receiverId] },
    });

    if (!match) {
      return res.status(403).json({ message: 'Cannot message this user.' });
    }

    const message = new Message({
      conversationId,
      sender: req.user._id,
      receiver: receiverId,
      content,
    });

    await message.save();

    // Update match's last message
    await Match.findByIdAndUpdate(match._id, {
      lastMessage: {
        content,
        timestamp: new Date(),
        sender: req.user._id,
      },
    });

    await message.populate('sender', 'name photos');

    res.status(201).json({ message: message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
