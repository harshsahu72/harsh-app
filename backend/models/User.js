const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 100,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'non-binary', 'other'],
    required: true,
  },
  interestedIn: {
    type: [String],
    enum: ['male', 'female', 'non-binary', 'other', 'everyone'],
    default: ['everyone'],
  },
  bio: {
    type: String,
    maxlength: 500,
    default: '',
  },
  interests: [{
    type: String,
    trim: true,
  }],
  photos: [{
    type: String, // URL or base64
  }],
  location: {
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
  },
  preferences: {
    ageMin: { type: Number, default: 18 },
    ageMax: { type: Number, default: 50 },
    maxDistance: { type: Number, default: 100 }, // km
  },
  likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isProfileComplete: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false }, // Prevent fake accounts
  verificationStatus: { 
    type: String, 
    enum: ['unverified', 'pending', 'verified', 'rejected'],
    default: 'unverified'
  },
  lastActive: { type: Date, default: Date.now },
  isOnline: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  subscriptionExpiresAt: { type: Date, default: null },
  trialExpiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours trial
  },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields when converting to JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.likedUsers;
  delete user.dislikedUsers;
  return user;
};

module.exports = mongoose.model('User', userSchema);
