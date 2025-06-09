import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Test route
app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Server is working' });
});

// In-memory storage
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    settings: {
      emailNotifications: true,
      pushNotifications: false,
      darkMode: false,
      twoFactorAuth: false,
      publicProfile: true
    }
  }
];

// Login route
app.post('/login', (req, res) => {
  console.log('Login route hit');
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    console.log('Login failed: Invalid credentials');
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id },
    'your_jwt_secret',
    { expiresIn: '24h' }
  );

  console.log('Login successful for user:', user.id);
  res.json({ 
    user: { 
      id: user.id,
      username: user.username,
      email: user.email
    }, 
    token 
  });
});

// Middleware to verify JWT token
const auth = (req, res, next) => {
  try {
    console.log('Auth middleware - checking token');
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    console.log('Token:', token);
    const decoded = jwt.verify(token, 'your_jwt_secret');
    console.log('Decoded token:', decoded);
    
    const user = users.find(u => u.id === decoded.id);
    console.log('Found user:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    console.log('Auth successful for user:', user.id);
    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Get settings
app.get('/settings', auth, (req, res) => {
  console.log('Get settings route hit');
  console.log('User:', req.user.id);
  console.log('Settings:', req.user.settings);
  res.json(req.user.settings);
});

// Update settings
app.put('/settings', auth, (req, res) => {
  console.log('Update settings route hit');
  console.log('User:', req.user.id);
  console.log('New settings:', req.body);

  const allowedSettings = [
    'emailNotifications',
    'pushNotifications',
    'darkMode',
    'twoFactorAuth',
    'publicProfile'
  ];

  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(update => allowedSettings.includes(update));

  if (!isValidOperation) {
    console.log('Invalid settings update:', req.body);
    return res.status(400).json({ message: 'Invalid settings!' });
  }

  req.user.settings = {
    ...req.user.settings,
    ...req.body
  };

  console.log('Updated settings:', req.user.settings);
  res.json({ message: 'Settings updated successfully', settings: req.user.settings });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /test');
  console.log('- POST /login');
  console.log('- GET /settings');
  console.log('- PUT /settings');
}); 