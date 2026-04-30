const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  conversationId: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastMessage: {
    content: String,
    timestamp: Date,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
}, { timestamps: true });

// Index for quick lookups
matchSchema.index({ users: 1 });

module.exports = mongoose.model('Match', matchSchema);
