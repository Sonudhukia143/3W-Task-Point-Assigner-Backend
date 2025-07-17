import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import usersRouter from './routes/users.js';
import claimsRouter from './routes/claims.js';

dotenv.config(); // loads environment variables from .env file

const corsOptions = {
  origin: ['http://localhost:5173','https://task-point-assigner.netlify.app'],   // allows requests from http://localhost:5173 and live url
  credentials: true,
  methods: ['GET', 'POST'],
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization'],
};
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, { 
  // creates a new Socket.IO server instance and configures it  to allow requests from http://localhost:5173
  cors: corsOptions
});

// Middleware
app.use(cors(corsOptions)); // allows requests from different origins
app.use(express.json());  // parses incoming requests with JSON payloads

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};
connectDB();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Routes
app.use('/api/users', usersRouter);
app.use('/api/claims', claimsRouter);

// Basic route for testing
app.get('/', (req, res) => {
  return res.json({ message: 'Leaderboard API is running!' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 