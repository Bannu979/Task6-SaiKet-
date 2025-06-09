import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}));
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

// API Routes
const apiRouter = express.Router();

// Test route
apiRouter.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Server is working' });
});

// Login route
apiRouter.post('/login', (req, res) => {
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
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
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

// Register route
apiRouter.post('/register', (req, res) => {
  console.log('Register route hit');
  const { username, email, password } = req.body;
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password,
    settings: {
      emailNotifications: true,
      pushNotifications: false,
      darkMode: false,
      twoFactorAuth: false,
      publicProfile: true
    }
  };

  users.push(newUser);
  console.log('New user registered:', newUser.id);
  
  res.status(201).json({ message: 'Registration successful' });
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
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

// Settings routes
apiRouter.get('/settings', auth, (req, res) => {
  console.log('Get settings route hit');
  console.log('User:', req.user.id);
  console.log('Settings:', req.user.settings);
  res.json(req.user.settings);
});

apiRouter.put('/settings', auth, (req, res) => {
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

// Mount API routes
app.use('/api', apiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({ message: 'Something went wrong!' });
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
}); 