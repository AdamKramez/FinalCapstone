/**
 * Mongoose User Model Schema
 * --------------------------
 * This file defines the structure of user data for the Political Bias Tracker application.
 * It includes:
 * - User credentials and identifiers
 * - A list of saved articles (each with metadata including political bias)
 * - A record of user search history
 * - A bias summary aggregation for tracking political leanings over time
 * 
 * These schemas are embedded into the main User schema and stored in a MongoDB collection.
 * Passwords are hashed and not stored in plaintext.
 */

const mongoose = require('mongoose');

// Schema for individual saved articles by the user
const SavedArticleSchema = new mongoose.Schema({
  url: { type: String, required: true }, // Full URL of the saved article
  news_source: { type: String, required: true }, // Source (e.g., BBC, Fox)
  rating: {
    type: String,
    enum: ['left', 'left-center', 'center', 'right', 'right-center'], // Political bias label
    required: false
  },
  rating_num: { type: Number }, // Numerical value representing political bias (1–5)
  confidence_level: { type: String }, // Confidence in bias rating (e.g., "High")
  timestamp: { type: Date, default: Date.now } // When the article was saved
});

// Schema for tracking the user's search history
const SearchHistorySchema = new mongoose.Schema({
  url: { type: String, required: true }, // Searched URL
  news_source: { type: String, required: true }, // Source from the search
  rating: {
    type: String,
    enum: ['left', 'center', 'right'], // Simplified bias label for history
    required: true
  },
  timestamp: { type: Date, default: Date.now } // When the search was performed
});

// Schema for aggregating bias counts from saved articles
const BiasSummarySchema = new mongoose.Schema({
  left: { type: Number, default: 0 },
  'left-center': { type: Number, default: 0 },
  center: { type: Number, default: 0 },
  'right-center': { type: Number, default: 0 },
  right: { type: Number, default: 0 }
});

// Main User schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // User's email
  username: { type: String, required: true, unique: true }, // Chosen username
  password: { type: String, required: true }, // Hashed password
  savedArticles: [SavedArticleSchema], // Array of saved articles
  searchHistory: [SearchHistorySchema], // Array of previous searches
  biasSummary: BiasSummarySchema // Aggregated bias rating summary
});

// Export the User model, avoiding duplicate model registration
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
