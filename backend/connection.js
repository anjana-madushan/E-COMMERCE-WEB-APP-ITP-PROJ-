require('dotenv').config();

const mongoose = require('mongoose');

// Use the environment variable if it exists, otherwise use the hardcoded URI
const connectionStr = process.env.MONGODB_CONNECTION_STR;

mongoose.connect(connectionStr, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

mongoose.connection.on('error', err => {
  console.log(err);
});
