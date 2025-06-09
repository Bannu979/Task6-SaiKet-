import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://task6.vercel.app',
  'https://task6-git-main.vercel.app',
  'https://task6-yourname.vercel.app'  // Replace 'yourname' with your Vercel username
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('Origin not allowed:', origin);
      return callback(null, false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
  try {
    console.log('Test route hit');
    res.json({ message: 'Server is working' });
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login route
apiRouter.post('/login', (req, res) => {
  try {
    console.log('Login route hit');
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Login attempt:', { email, password });
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      console.log('Login failed: Invalid credentials');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'task6_secure_jwt_secret_key_2024_dashboard',
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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register route
apiRouter.post('/register', (req, res) => {
  try {
    console.log('Register route hit');
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

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
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
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
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'task6_secure_jwt_secret_key_2024_dashboard'
    );
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
    res.status(401).json({ message: 'Please authenticate', error: error.message });
  }
};

// Settings routes
apiRouter.get('/settings', auth, (req, res) => {
  try {
    console.log('Get settings route hit');
    console.log('User:', req.user.id);
    console.log('Settings:', req.user.settings);
    res.json(req.user.settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

apiRouter.put('/settings', auth, (req, res) => {
  try {
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
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mount API routes
app.use('/api', apiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
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