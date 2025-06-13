import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const app = express();

// Basic middleware
app.use(express.json());

// CORS middleware - specific configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://task6-sai-ket-o4so.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

// MongoDB Connection
const connectDB = async () => {
  try {
    const MONGODB_URI = 'mongodb+srv://cherrymilky2020:bannu979@cluster0.pgvd2ic.mongodb.net/Saiket?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    // Retry connection after 5 seconds
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Connect to MongoDB
connectDB();

// Request logging middleware
app.use((req, res, next) => {
  console.log('--------------------');
  console.log('Incoming Request:');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('--------------------');
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Task Management API is running',
    endpoints: {
      test: '/api/test',
      login: '/api/login',
      register: '/api/register',
      settings: '/api/settings'
    }
  });
});

// API Routes
const apiRouter = express.Router();

// Test route
apiRouter.get('/test', (req, res) => {
  try {
    console.log('Test route hit');
    res.json({ message: 'Server is working' });
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login route
apiRouter.post('/login', async (req, res) => {
  try {
    console.log('Login route hit');
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Login attempt:', { email });
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'task6_secure_jwt_secret_key_2024_dashboard',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    console.log('Login successful for user:', user._id);
    res.json({ 
      user: { 
        id: user._id,
        username: user.username,
        email: user.email,
        settings: user.settings
      }, 
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register route
apiRouter.post('/register', async (req, res) => {
  try {
    console.log('Register route hit');
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password
    });

    await newUser.save();
    console.log('New user registered:', newUser._id);
    
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    console.log('Auth middleware - checking token');
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    console.log('Token:', token);
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'task6_secure_jwt_secret_key_2024_dashboard'
    );
    console.log('Decoded token:', decoded);
    
    const user = await User.findById(decoded.id);
    console.log('Found user:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    console.log('Auth successful for user:', user._id);
    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user settings
apiRouter.get('/settings', auth, async (req, res) => {
  try {
    res.json({ settings: req.user.settings });
  } catch (error) {
    console.error('Settings fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user settings
apiRouter.put('/settings', auth, async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!settings) {
      return res.status(400).json({ message: 'Settings object is required' });
    }

    req.user.settings = { ...req.user.settings, ...settings };
    await req.user.save();
    
    res.json({ message: 'Settings updated successfully', settings: req.user.settings });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mount API routes
app.use('/api', apiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// 404 handler - must be last
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /');
  console.log('- GET /api/test');
  console.log('- POST /api/login');
  console.log('- POST /api/register');
  console.log('- GET /api/settings');
  console.log('- PUT /api/settings');
  console.log('connected to db')
}); 