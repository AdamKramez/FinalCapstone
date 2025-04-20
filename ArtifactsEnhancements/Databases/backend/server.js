/*
this is the main server file that sets up our express application
it handles all the middleware, routes, and server configuration
basically the heart of our backend
*/

require('dotenv').config();
require('./models/db'); // brings in mongoDB and triggers connection
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');


const app = express();

// middleware setup
app.use(cors()); // allows cross-origin requests
app.use(express.json()); // parses incoming json requests
app.use(helmet()); // adds secure HTTP headers

// rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

// simple logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// basic health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// api routes setup
// handles user search functionality
const searchRoutes = require('./routes/userSearch');
app.use('/api/userSearch', searchRoutes);

// handles authentication (login, register, logout)
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// handles user-specific actions like saving articles
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

// start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
