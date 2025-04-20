const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const csv = require('csvtojson');


//loads mongoose publication schema model so that it can be inserted into database
const Publication = require('../models/publication');
 
// connects to mongo db instance
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB')) // handles success message for mongoDB connection attempt
.catch((err) => console.error('MongoDB connection error:', err)); // handles failure message for mongodb attempt


const importCSV = async () => {
    const filePath = path.join(__dirname, 'allsides_data.csv');

  
    try {
      const jsonArray = await csv().fromFile(filePath);
  
      // Transform and filter fields
      const publications = jsonArray.map(row => ({
        news_source: row.news_source?.trim(),
        rating: row.rating?.trim(),
        rating_num: !isNaN(Number(row.rating_num)) ? Number(row.rating_num) : undefined,
        type: row.type?.trim(),
        url: row.url?.trim(),
        domain: null,
        confidence_level: row.confidence_level?.trim(),
      })).filter(pub => pub.news_source && pub.rating); // come back here to include filtering out for url fields
  
      // Insert into MongoDB
      await Publication.insertMany(publications);
      console.log(`Successfully inserted ${publications.length} publications`);
      mongoose.disconnect();
    } catch (err) {
      console.error('Error during import:', err);
      mongoose.disconnect();
    }
  };
  
  importCSV();
