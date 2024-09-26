const express = require("express");
const cors = require("cors");
const app = express();
const http = require('http');
const passportStrategy = require("./configs/passport
const session = require("express-session");
require("dotenv").config({ path: ".env.local" });
const Stripe = require('stripe');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const passport = require('passport');
require('./configs/passport');
app.use(passport.initialize());


/**TODO: @Anjana - Configure secure environment variables for Stripe**/
const stripe = Stripe(
  "sk_test_51LhBwPD1ftP7zi2EFzCqknBRwERKsNxtKCEJGL7I6ng3mSy6nOAW8kSIz8ivpxVXBpGfcObm7cRCFzqh1rIHcDYR00VAPeCQ9k"
);

require("./connection");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: "*",
  methods: "*",
});

// const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const feedbackRoutes = require("./routes/feedbackRoutes");
const imageRoutes = require('./routes/imageRoutes')
const orderRoutes = require('./routes/orderRoutes');
const stockRoute = require('./routes/stock.route')
const gradeRoute = require('./routes/grade.route')

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Request received:', req.method, req.url);
  next();
});

app.use('/auth', authRoutes);
app.use('/users', passport.authenticate('jwt', { session: false }), userRoutes);
app.use('/products', passport.authenticate('jwt', { session: false }), productRoutes);
app.use('/images', passport.authenticate('jwt', { session: false }), imageRoutes);
app.use("/feedbacks", passport.authenticate('jwt', { session: false }), feedbackRoutes);
app.use('/orders', passport.authenticate('jwt', { session: false }), orderRoutes);
app.use('/stocks', passport.authenticate('jwt', { session: false }), stockRoute)
app.use('/grades', passport.authenticate('jwt', { session: false }), gradeRoute)

//Stripe payments
app.post('/create-payment', passport.authenticate('jwt', { session: false }), async (req, res) => {

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const imageRoutes = require("./routes/imageRoutes");
const orderRoutes = require("./routes/orderRoutes");
const stockRoute = require("./routes/stock.route");
const gradeRoute = require("./routes/grade.route");

// Configure express-session middleware
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
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/images", imageRoutes);
app.use("/feedbacks", feedbackRoutes);
app.use("/orders", orderRoutes);
app.use("/stocks", stockRoute);
app.use("/grades", gradeRoute);

//Stripe payments
app.post("/create-payment", async (req, res) => {
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

server.listen(4000, () => {
  console.log("server running at port", 4000);
});

app.set("socketio", io);
