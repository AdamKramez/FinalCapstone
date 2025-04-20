const mongoose = require('mongoose');
const readLine = require('readline');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const dbURI = process.env.MONGO_URI || " ";

// Get JWT secret from environment variables for token verification
const JWT_SECRET = process.env.JWT_SECRET;

// Make initial connection
const connect = () => {
  setTimeout(() => {
    mongoose.connect(dbURI);
  }, 1000);
};


// Monitor connection events
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', err => {
  console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Windows-specific listener for graceful shutdown
if (process.platform === 'win32') {
  const r1 = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  r1.on('SIGINT', () => {
    process.emit('SIGINT');
  });
}

// Graceful shutdown helper
const gracefulShutdown = (msg) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
  });
};

// Handle termination signals
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart');
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', () => {
  gracefulShutdown('app termination');
  process.exit(0);
});

process.on('SIGTERM', () => {
  gracefulShutdown('app shutdown');
  process.exit(0);
});

// Connect and register models
connect();
require('../models/publication'); // just registers the model

/**
 * Authentication Middleware
 * 
 * Express middleware that verifies JWT tokens in incoming requests
 * Protects routes by ensuring only authenticated users can access them
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @description
 * This middleware:
 * 1. Extracts the JWT token from the Authorization header
 * 2. Verifies the token's validity using the JWT_SECRET
 * 3. Attaches the decoded user information to the request object
 * 4. Handles various authentication error cases
 * 
 * @throws {Error} If token verification fails or token is missing
 * 
 * @example
 * // Usage in routes:
 * router.get('/protected-route', authMiddleware, (req, res) => {
 *   // Only accessible with valid token
 *   res.json({ message: 'Protected content' });
 * });
 */
const authMiddleware = (req, res, next) => {
  // Extract token from Authorization header (Bearer token format)
  const token = req.headers.authorization?.split(' ')[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Verify token and decode its payload
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach decoded user information to request object for use in route handlers
    req.user = decoded;
    // Proceed to the next middleware/route handler
    next();
  } catch (err) {
    // Log token verification errors
    console.error('Token verification failed:', err);
    // Return unauthorized response for invalid tokens
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = { mongoose, authMiddleware };
