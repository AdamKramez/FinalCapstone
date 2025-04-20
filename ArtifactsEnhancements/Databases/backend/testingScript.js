console.log('Script started');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });


const mongoose = require('mongoose');
const Publication = require('./models/publication');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const results = await Publication.find({ domain: null });
    console.log(results.length, "documents not updated");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });