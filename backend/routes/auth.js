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
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
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
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save({ validateBeforeSave: false });

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
        photos: user.photos,
        bio: user.bio,
        interests: user.interests,
        isProfileComplete: user.isProfileComplete,
        isVerified: user.isVerified,
        location: user.location,
        preferences: user.preferences,
        interestedIn: user.interestedIn,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
const { authenticate } = require('../middleware/auth');

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
