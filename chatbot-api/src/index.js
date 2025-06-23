const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');

// Routes
const authRoutes = require('./routes/authRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app); 
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});


app.set('io', io);

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/analytics', analyticsRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Chatbot API is running ✅');
});

// WebSocket setup
io.on('connection', (socket) => {
  console.log('🔌 New client connected');

  // Join room for a conversation
  socket.on('joinRoom', (conversationId) => {
    socket.join(conversationId);
    console.log(`🟢 Client joined room: ${conversationId}`);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected');
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB error:', err));
