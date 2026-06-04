// Override DNS resolution servers for Node's internal dns library (c-ares)
// to prevent ECONNREFUSED with MongoDB Atlas querySrv SRV records on Windows.
try {
  require('dns').setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Failed to set custom DNS servers:', e);
}

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const matchRoutes = require('./routes/matches');
const messageRoutes = require('./routes/messages');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: true, // Allow all origins — consistent with Express CORS (dev mode)
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: true, // Allow all origins (dev mode)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Flamr API is running 🔥' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flamr')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Socket.io real-time chat
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // User joins with their userId
  socket.on('user_online', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });

  // Join a conversation room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`👥 User joined room: ${roomId}`);
  });

  // Send a message
  socket.on('send_message', async (data) => {
    const { roomId, senderId, receiverId, message, timestamp } = data;
    
    // Save message to database
    try {
      const Message = require('./models/Message');
      const newMessage = new Message({
        conversationId: roomId,
        sender: senderId,
        receiver: receiverId,
        content: message,
        timestamp: timestamp || new Date(),
      });
      await newMessage.save();
      
      // Emit to room
      io.to(roomId).emit('receive_message', {
        _id: newMessage._id,
        conversationId: roomId,
        sender: senderId,
        receiver: receiverId,
        content: message,
        timestamp: newMessage.timestamp,
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Typing indicator
  socket.on('typing', ({ roomId, userId }) => {
    socket.to(roomId).emit('user_typing', { userId });
  });

  socket.on('stop_typing', ({ roomId, userId }) => {
    socket.to(roomId).emit('user_stop_typing', { userId });
  });

  // ─── Call Signaling ─────────────────────────────────────────────────
  // Step 1: Caller sends offer to callee
  socket.on('call_offer', ({ to, offer, callType, from }) => {
    const recipientSocketId = onlineUsers.get(to);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('incoming_call', { from, offer, callType });
    } else {
      socket.emit('call_failed', { reason: 'User is offline or unavailable.' });
    }
  });

  // Step 2: Callee sends answer back to caller
  socket.on('call_answer', ({ to, answer }) => {
    const callerSocketId = onlineUsers.get(to);
    if (callerSocketId) {
      io.to(callerSocketId).emit('call_answered', { answer });
    }
  });

  // Step 3: Exchange ICE candidates (both directions)
  socket.on('call_ice_candidate', ({ to, candidate }) => {
    const targetSocketId = onlineUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('ice_candidate', { candidate });
    }
  });

  // Callee rejects the incoming call
  socket.on('call_reject', ({ to }) => {
    const callerSocketId = onlineUsers.get(to);
    if (callerSocketId) {
      io.to(callerSocketId).emit('call_rejected');
    }
  });

  // Either party ends the active call
  socket.on('call_end', ({ to }) => {
    const targetSocketId = onlineUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('call_ended');
    }
  });
  // ────────────────────────────────────────────────────────────────────

  // Disconnect
  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit('online_users', Array.from(onlineUsers.keys()));
    }
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Flamr server running on port ${PORT}`);
    console.log(`🌐 Local:   http://localhost:${PORT}/api`);
    console.log(`📱 Network: http://172.21.2.152:${PORT}/api`);
  });
}

module.exports = app;
