// models/Publication.js
const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  news_source: { type: String, required: true },    // e.g., "ABC News"
  rating: { type: String, required: true },         // e.g., "left-center"
  rating_num: { type: Number },                     // e.g., 2
  type: { type: String },                           // e.g., "News Media"
  url: { type: String },                            // AllSides profile link
  domain: { type: String },                         // e.g., "abcnews.go.com"
  confidence_level: { type: String }                // e.g., "High"
});

module.exports = mongoose.model('Publication', publicationSchema);

