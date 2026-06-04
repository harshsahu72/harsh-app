const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, age, gender } = req.body;

    if (!email || !password || !name || !age || !gender) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered. Please login.' });
    }

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password,
      name,
      age: parseInt(age),
      gender,
    });

    await user.save();
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully! 🎉',
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        gender: user.gender,
        isProfileComplete: user.isProfileComplete,
        isVerified: user.isVerified,
        trialExpiresAt: user.trialExpiresAt,
        subscriptionExpiresAt: user.subscriptionExpiresAt,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages[0] });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already exists.' });
    }
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find user (include password for comparison)
    // Use case-insensitive search for older accounts
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Update last active in background
    try {
      user.lastActive = new Date();
      await user.save({ validateBeforeSave: false });
    } catch (saveError) {
      console.error('Failed to update lastActive:', saveError);
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Welcome back! 🔥',
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        gender: user.gender,
        photos: user.photos || [],
        bio: user.bio || '',
        interests: user.interests || [],
        isProfileComplete: user.isProfileComplete,
        isVerified: user.isVerified,
        location: user.location || { city: '', country: '' },
        preferences: user.preferences || { ageMin: 18, ageMax: 50 },
        interestedIn: user.interestedIn || ['everyone'],
        trialExpiresAt: user.trialExpiresAt,
        subscriptionExpiresAt: user.subscriptionExpiresAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error. Please contact support.' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
const { authenticate } = require('../middleware/auth');

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -likedUsers -dislikedUsers');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
