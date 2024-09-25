const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ms = require('ms');

// JWT secret and expiry times
const accessTokenSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;
const issuer = process.env.ISSUER;

// Generate tokens
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, accessTokenSecret, { expiresIn: accessTokenLife, issuer: issuer });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, refreshTokenSecret, { expiresIn: refreshTokenLife, issuer: issuer });
};

//signup
router.post('/signup', async (req, res) => {
  const { name, bdate, address, email, password } = req.body;

  try {
    const user = await User.create({ name, bdate, address, email, password });
    res.json(user);
  } catch (e) {
    if (e.code === 11000) return res.status(400).send({ error: 'Email already exists' });
    res.status(400).send({ error: e.message })
  }
})

//login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.tokens.push(refreshToken);
    await user.save();

    // Set cookies with HttpOnly and Secure flags
    res.cookie('accessToken', accessToken, {
      httpOnly: true, // Prevent access from JavaScript
      secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
      sameSite: 'strict',
      maxAge: ms(accessTokenLife) // (15 minutes)
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: ms(refreshTokenLife), // (7 days)
    });

    res.json(user.toJSON());
  } catch (e) {
    res.status(400).send(e.message)
  }
})


// Refresh Token Route
router.post('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
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

    res.cookie('accessToken', accessToken, {
      httpOnly: true, // Prevent access from JavaScript
      secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
      sameSite: 'strict',
      maxAge: ms(accessTokenLife) // (15 minutes)
    });

    res.status(200).send({ message: "Access Token Refreshed" });
  } catch (e) {
    res.status(403).send("Invalid Token");
  }
});


// Logout Route
router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).send({ message: 'Logged out successfully' });
});

module.exports = router;