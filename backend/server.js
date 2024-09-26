const express = require("express");
const cors = require("cors");
const app = express();
const http = require('http');
const passportStrategy = require("./configs/passport");
const session = require("express-session");
require("dotenv").config({ path: ".env.local" });
const Stripe = require('stripe');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const passport = require('passport');
require('./configs/passport');
app.use(passport.initialize());

/**TODO: @Anjana - Configure secure environment variables for Stripe**/
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Secure your Stripe key by using env variables

require("./connection");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: "*",
  methods: "*",
});

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const feedbackRoutes = require("./routes/feedbackRoutes");
const imageRoutes = require('./routes/imageRoutes');
const orderRoutes = require('./routes/orderRoutes');
const stockRoute = require('./routes/stock.route');
const gradeRoute = require('./routes/grade.route');

// Middleware setup
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log('Request received:', req.method, req.url);
  next();
});

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key", // Replace with a strong secret key
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Save new sessions
    cookie: { secure: false }, // Set secure: true if using HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/users', passport.authenticate('jwt', { session: false }), userRoutes);
app.use('/products', passport.authenticate('jwt', { session: false }), productRoutes);
app.use('/images', passport.authenticate('jwt', { session: false }), imageRoutes);
app.use("/feedbacks", passport.authenticate('jwt', { session: false }), feedbackRoutes);
app.use('/orders', passport.authenticate('jwt', { session: false }), orderRoutes);
app.use('/stocks', passport.authenticate('jwt', { session: false }), stockRoute);
app.use('/grades', passport.authenticate('jwt', { session: false }), gradeRoute);

// Stripe payments
app.post('/create-payment', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { amount } = req.body;
  console.log(amount);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.status(200).json(paymentIntent);
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.message);
  }
});

// Start server
server.listen(4000, () => {
  console.log("server running at port", 4000);
});

app.set("socketio", io);
