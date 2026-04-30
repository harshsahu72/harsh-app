const express = require('express');
const Match = require('../models/Match');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/matches
// @desc    Get all matches for current user
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const matches = await Match.find({
      users: { $in: [req.user._id] },
      isActive: true,
    }).populate({
      path: 'users',
      select: 'name age photos bio interests lastActive',
    });

    // Format: return the other user's info
    const formattedMatches = matches.map((match) => {
      const otherUser = match.users.find(
        (u) => u._id.toString() !== req.user._id.toString()
      );
      return {
        matchId: match._id,
        conversationId: match.conversationId,
        user: otherUser,
        lastMessage: match.lastMessage,
        createdAt: match.createdAt,
      };
    });

    res.json({ matches: formattedMatches });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   GET /api/matches/:conversationId
// @desc    Get a specific match by conversation ID
// @access  Private
router.get('/:conversationId', authenticate, async (req, res) => {
  try {
    const match = await Match.findOne({
      conversationId: req.params.conversationId,
      users: { $in: [req.user._id] },
    }).populate('users', 'name age photos bio');

    if (!match) {
      return res.status(404).json({ message: 'Match not found.' });
    }

    res.json({ match });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   DELETE /api/matches/:matchId
// @desc    Unmatch a user
// @access  Private
router.delete('/:matchId', authenticate, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found.' });
    }

    if (!match.users.includes(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    match.isActive = false;
    await match.save();

    // Remove from both users' matches
    const otherUserId = match.users.find(
      (id) => id.toString() !== req.user._id.toString()
    );
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { matches: otherUserId },
    });
    await User.findByIdAndUpdate(otherUserId, {
      $pull: { matches: req.user._id },
    });

    res.json({ message: 'Unmatched successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
