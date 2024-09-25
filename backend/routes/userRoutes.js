const router = require('express').Router();
const passport = require('passport');
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

//signup
router.post('/signup', async (req, res) => {
  const { name, bdate, address, email, password } = req.body;

  try {
    const user = await User.create({ name, bdate, address, email, password });
    res.json(user);
  } catch (e) {
    if (e.code === 11000) return res.status(400).send('Email already exists');
    res.status(400).send(e.message)
  }
})

//login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    // const accessToken = generateAccessToken(user);
    // const refreshToken = generateRefreshToken(user);

    // user.tokens.push(refreshToken);
    await user.save();

    // res.json({ accessToken, refreshToken, user: user.toJSON() });
    res.json({ user: user.toJSON() });
  } catch (e) {
    res.status(400).send(e.message)
  }
})

//OAuth login 
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", {
  successRedirect: process.env.CLIENT_URL,
  failureRedirect: "/login/failed",
}));

//login failed
router.get('/login/failed', (req, res) => {
  res.status(400).send('OAuth Login Failed')
})

//get user
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).populate('orders');
    res.json(users);
  } catch (e) {
    res.status(400).send(e.message);
  }
})
module.exports = router;

//get a user
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const users = await User.findById(id);
    res.json(users);
  } catch (e) {
    res.status(400).send(e.message);
  }
})
module.exports = router;

// get user orders
router.get('/:id/orders', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate('orders');
    res.json(user.orders);
  } catch (e) {
    res.status(400).send(e.message);
  }
})

// update user notifcations
router.post('/:id/updateNotifications', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    user.notifications.forEach((notif) => {
      notif.status = "read"
    });
    user.markModified('notifications');
    await user.save();
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e.message)
  }
})

// Refresh Token Route
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).send("Refresh Token Required");

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);
    const user = await User.findById(decoded.id);

    if (!user || !user.tokens.includes(refreshToken)) {
      return res.status(403).send("Invalid Refresh Token");
    }

    // Generate a new access token
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (e) {
    res.status(403).send("Invalid Token");
  }
});