const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT secret and expiry times
const accessTokenSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
const accessTokenLife = '15m';
const refreshTokenLife = '7d';

// Generate tokens
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, accessTokenSecret, { expiresIn: accessTokenLife });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, refreshTokenSecret, { expiresIn: refreshTokenLife });
};

// Signup
router.post('/signup', async (req, res) => {
  const { name, bdate, address, email, password } = req.body;

  try {
    const user = await User.create({ name, bdate, address, email, password });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Error creating user:', e);
    res.status(500).json({ message: 'Failed to create user. Please try again later.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.tokens.push(refreshToken);
    await user.save();

    res.status(200).json({ accessToken, refreshToken, user: user.toJSON() });
  } catch (e) {
    console.error('Login error:', e);
    res.status(400).json({ message: 'Invalid login credentials' });
  }
});

// Get all users (non-admin)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).populate('orders');
    res.status(200).json(users);
  } catch (e) {
    console.error('Error fetching users:', e);
    res.status(500).json({ message: 'Failed to retrieve users. Please try again later.' });
  }
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (e) {
    console.error('Error fetching user:', e);
    res.status(500).json({ message: 'Failed to retrieve user. Please try again later.' });
  }
});

// Get user orders by ID
router.get('/:id/orders', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate('orders');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.orders);
  } catch (e) {
    console.error('Error fetching user orders:', e);
    res.status(500).json({ message: 'Failed to retrieve user orders. Please try again later.' });
  }
});

// Update user notifications (mark as read)
router.post('/:id/updateNotifications', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.notifications.forEach((notif) => {
      notif.status = "read";
    });
    user.markModified('notifications');
    await user.save();

    res.status(200).json({ message: 'Notifications updated successfully' });
  } catch (e) {
    console.error('Error updating notifications:', e);
    res.status(500).json({ message: 'Failed to update notifications. Please try again later.' });
  }
});

// Refresh Token
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Refresh Token Required" });

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);
    const user = await User.findById(decoded.id);

    if (!user || !user.tokens.includes(refreshToken)) {
      return res.status(403).json({ message: "Invalid Refresh Token" });
    }

    // Generate a new access token
    const accessToken = generateAccessToken(user);
    res.status(200).json({ accessToken });
  } catch (e) {
    console.error('Error refreshing token:', e);
    res.status(403).json({ message: "Invalid or expired Refresh Token" });
  }
});

module.exports = router;
