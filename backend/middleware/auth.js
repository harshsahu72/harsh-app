const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided. Access denied.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found. Access denied.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ message: 'Invalid token. Access denied.' });
  }
};

const checkSubscription = async (req, res, next) => {
  const user = req.user;
  const isTrialActive = user.trialExpiresAt && new Date() < user.trialExpiresAt;
  const isSubscriptionActive = user.subscriptionExpiresAt && new Date() < user.subscriptionExpiresAt;

  if (isTrialActive || isSubscriptionActive || user.isVerified) {
    return next();
  }

  res.status(403).json({ 
    message: 'Trial expired. Please subscribe to continue.',
    trialExpired: true 
  });
};

module.exports = { authenticate, checkSubscription };
