//require('dotenv').config();// Import environment variables
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

const mongoose = require('mongoose');
require('../../models/db');// Connect to the MongoDB database
const Publication = require('../../models/publication');// Mongoose model for the publications collection
const scrapeWebsiteUrl = require('./scrapeWebsiteUrl');// Import the Puppeteer scraping helper to get the real website URL
const cleanUrl = require('./cleanUrl');// Import a helper to clean the URL 

// Utility function to wait for a specified number of milliseconds
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Main async function to update all publications with missing domain fields
const updatePublications = async () => {
  try {
    // Find publications that are missing a 'domain' field
    const publications = await Publication.find({ domain: null });

    console.log(`Found ${publications.length} publications without a domain\n`);

    // Loop through each publication
    for (const pub of publications) {
      console.log(`Scraping: ${pub.news_source}`);

      // Attempt to scrape the official site URL from AllSides
      const rawUrl = await scrapeWebsiteUrl(pub.url);

      if (rawUrl) {
        // Clean the scraped URL (e.g., turn 'https://www.cbsnews.com/' into 'cbsnews.com')
        const domain = cleanUrl(rawUrl);

        if (domain) {
          // Update the publication document in MongoDB
          await Publication.updateOne({ _id: pub._id }, { $set: { domain } });

          console.log(`Updated domain to: ${domain}\n`);
        } else {
          console.warn(`Could not clean URL for ${pub.news_source}`);
        }
      } else {
        console.warn(`Failed to scrape site for ${pub.news_source}`);
      }
    }

    console.log('\n🎉 Update process complete!');
    process.exit(0); // Exit the script successfully
  } catch (err) {
    console.error('Error in update process:', err.message);
    process.exit(1); // Exit with an error
  }
};

/*const updateFirstFivePublications = async () => {
    try {
      // Limit to first 5 documents that do NOT already have a URL
      const publications = await Publication.find().limit(5);

      console.log(publications);
  
      for (const pub of publications) {
        console.log(`🔍 Scraping website for: ${pub.news_source}`);
  
        const websiteUrl = await scrapeWebsiteUrl(pub.url); // e.g. AllSides profile page
  
        if (websiteUrl) {
          const domain = cleanUrl(websiteUrl);
  
          pub.url = websiteUrl;
          pub.domain = domain;
  
          await pub.save();
          console.log(`✅ Updated ${pub.news_source} with domain ${domain}`);
        } else {
          console.log(`⚠️ Could not find a website for ${pub.news_source}`);
        }
  
        // Wait 10 seconds before moving to next publication
        await delay(10000);
      }
  
      mongoose.disconnect();
      console.log("🔚 Finished updating 5 publications.");
    } catch (err) {
      console.error("❌ Error updating publications:", err);
      mongoose.disconnect();
    }
  };*/
  
//updateFirstFivePublications();
// Run the updater
updatePublications();
