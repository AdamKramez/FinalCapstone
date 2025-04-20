const mongoose = require('./db');
require('dotenv').config();

const Publication = require('../models/publication');

const seedData = [
    {
      news_source: "Seed News Source 1",
      rating: "left",
      rating_num: 1,
      type: "News Media",
      confidence_level: "High"
    },
    {
      news_source: "Seed News Source 2",
      rating: "right-center",
      rating_num: 4,
      type: "Think Tank",
      confidence_level: "Medium"
    },
    {
      news_source: "The Seed Times",
      rating: "center",
      rating_num: 3,
      type: "News Media",
      confidence_level: "Initial Rating"
    },
    {
      news_source: "Fake Facts Daily",
      rating: "right",
      rating_num: 5,
      type: "News Media",
      confidence_level: "High"
    },
    {
      news_source: "Balanced Buzz",
      rating: "left-center",
      rating_num: 2,
      type: "Policy Group",
      confidence_level: "Low"
    }
  ];
  
  const seedDatabase = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
  
      console.log('Connected to MongoDB');
  
      //await Publication.deleteMany({});
      //console.log('Existing publications removed');
  
      await Publication.insertMany(seedData);
      console.log('Seed data inserted successfully');
  
      mongoose.disconnect();
    } catch (error) {
      console.error('Error seeding the database:', error);
      mongoose.disconnect();
    }
  };
  
  seedDatabase();