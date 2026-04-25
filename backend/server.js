import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import designRoutes from './routes/designRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import savedDesignRoutes from './routes/savedDesignRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import customRequestRoutes from './routes/customRequestRoutes.js';
import browseHistoryRoutes from './routes/browseHistoryRoutes.js';
import contactMessageRoutes from './routes/contactMessageRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);
const allowedOrigins = process.env.FRONTEND_URL 
  ? [process.env.FRONTEND_URL, 'http://localhost:5173'] 
  : '*';

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
});

// Middleware
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from public folder
app.use(express.static('public'));
// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/saved-designs', savedDesignRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/custom-requests', customRequestRoutes);
app.use('/api/browse-history', browseHistoryRoutes);
app.use('/api/contact-messages', contactMessageRoutes);

// Socket.io Implementation
io.on('connection', (socket) => {
  console.log('User connected to socket:', socket.id);

  // User joins their own personal room to receive updates
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  // User joins a specific conversation room
  socket.on('join chat', (room) => {
    // Convert to string in case it's an object
    const roomId = typeof room === 'object' ? room._id || room.toString() : room.toString();
    socket.join(roomId);
    console.log('User Joined Room: ' + roomId);
  });

  // Send a new message
  socket.on('new message', (newMessageReceived) => {
    const conversation = newMessageReceived.conversationId;
    if (!conversation) return console.log('Message conversation missing');

    // Convert to string in case it's an object
    const conversationId = typeof conversation === 'object' ? conversation._id || conversation.toString() : conversation.toString();

    // Broadcast message to everyone in the room except the sender
    socket.in(conversationId).emit('message received', newMessageReceived);
    
    // Also emit a notification event to participants' personal rooms
    // assuming clients could provide their target recipients
    if (newMessageReceived.targetUserId) {
       socket.in(newMessageReceived.targetUserId).emit('new message notification', newMessageReceived);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running...' });
});

// Root fallback
app.get('/', (req, res) => {
  res.send('Nail Salon Backend API');
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
