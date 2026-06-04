const express = require('express');
const User = require('../models/User');
const { authenticate, checkSubscription } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/discover
// @desc    Get users to swipe on (filtered)
// @access  Private
router.get('/discover', authenticate, checkSubscription, async (req, res) => {
  try {
    const currentUser = req.user;
    const { ageMin, ageMax, gender, page = 0 } = req.query;

    const minAge = ageMin ? parseInt(ageMin) : currentUser.preferences.ageMin;
    const maxAge = ageMax ? parseInt(ageMax) : currentUser.preferences.ageMax;
    const limit = 10;
    const skip = parseInt(page) * limit;

    // Exclude already swiped users + self
    const excludeIds = [
      req.user._id,
      ...currentUser.likedUsers,
      ...currentUser.dislikedUsers,
      ...currentUser.matches,
    ];

    const query = {
      _id: { $nin: excludeIds },
      age: { $gte: minAge, $lte: maxAge },
      isProfileComplete: true,
    };

    // Gender filter
    const interested = gender || currentUser.interestedIn;
    if (interested && !interested.includes('everyone') && interested.length > 0) {
      query.gender = { $in: Array.isArray(interested) ? interested : [interested] };
    }

    const users = await User.find(query)
      .select('name age gender bio interests photos location lastActive')
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      hasMore: skip + limit < total,
      total,
    });
  } catch (error) {
    console.error('Discover error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -likedUsers -dislikedUsers');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, async (req, res) => {
  try {
    const {
      name, age, bio, interests, photos, location,
      preferences, interestedIn, gender,
    } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (age) updates.age = parseInt(age);
    if (bio !== undefined) updates.bio = bio;
    if (interests) updates.interests = interests;
    if (photos) updates.photos = photos;
    if (location) updates.location = location;
    if (preferences) updates.preferences = preferences;
    if (interestedIn) updates.interestedIn = interestedIn;
    if (gender) updates.gender = gender;

    // Check if profile is complete (name, age, gender are the minimum requirements)
    const user = await User.findById(req.user._id);
    const merged = { ...user.toObject(), ...updates };
    if (merged.name && merged.age && merged.gender) {
      updates.isProfileComplete = true;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -likedUsers -dislikedUsers');

    res.json({
      message: 'Profile updated successfully! ✨',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   POST /api/users/like/:id
// @desc    Like a user
// @access  Private
router.post('/like/:id', authenticate, checkSubscription, async (req, res) => {
  try {
    const likedUserId = req.params.id;
    const currentUserId = req.user._id;

    if (likedUserId === currentUserId.toString()) {
      return res.status(400).json({ message: 'Cannot like yourself.' });
    }

    // Add to liked list if not already liked
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { likedUsers: likedUserId },
      $pull: { dislikedUsers: likedUserId },
    });

    // Check if the other person also liked current user (mutual match)
    const likedUser = await User.findById(likedUserId);
    if (!likedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = likedUser.likedUsers.includes(currentUserId);

    if (isMatch) {
      // Create match
      const Match = require('../models/Match');
      
      // Generate conversation ID (sorted to be consistent regardless of who liked first)
      const ids = [currentUserId.toString(), likedUserId.toString()].sort();
      const conversationId = `conv_${ids[0]}_${ids[1]}`;

      const existingMatch = await Match.findOne({ conversationId });
      if (!existingMatch) {
        await Match.create({
          users: [currentUserId, likedUserId],
          conversationId,
        });
      }

      // Add to both users' matches
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { matches: likedUserId },
      });
      await User.findByIdAndUpdate(likedUserId, {
        $addToSet: { matches: currentUserId },
      });

      return res.json({
        isMatch: true,
        message: "It's a match! 🔥💕",
        matchedUser: {
          _id: likedUser._id,
          name: likedUser.name,
          photos: likedUser.photos,
        },
        conversationId,
      });
    }

    res.json({
      isMatch: false,
      message: 'Liked! Waiting for them to like back.',
    });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   POST /api/users/dislike/:id
// @desc    Dislike (pass) a user
// @access  Private
router.post('/dislike/:id', authenticate, checkSubscription, async (req, res) => {
  try {
    const dislikedUserId = req.params.id;
    const currentUserId = req.user._id;

    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { dislikedUsers: dislikedUserId },
      $pull: { likedUsers: dislikedUserId },
    });

    res.json({ message: 'Passed.' });
  } catch (error) {
    console.error('Dislike error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   POST /api/users/verify
// @desc    Subscribe for 499 monthly after 24h trial
// @access  Private
router.post('/verify', authenticate, async (req, res) => {
  try {
    const { paymentToken } = req.body;
    
    if (paymentToken !== 'mock-payment-success') {
      return res.status(400).json({ message: 'Payment failed or invalid.' });
    }

    // Set subscription to 30 days from now
    const subscriptionExpiresAt = new Date(+new Date() + 30 * 24 * 60 * 60 * 1000);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $set: { 
          isVerified: true, 
          verificationStatus: 'verified',
          isPremium: true,
          subscriptionExpiresAt
        } 
      },
      { new: true }
    ).select('-password -likedUsers -dislikedUsers');

    res.json({
      message: 'Subscription successful! You have 30 days of full access. 🔥',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ message: 'Server error during subscription.' });
  }
});

module.exports = router;
