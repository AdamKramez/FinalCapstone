const path = require('path');
// Load environment variables from .env file
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
// backend/data/scripts/addDomainField.js
const mongoose = require('mongoose');

// Import the Publication model for database operations
const Publication = require('../../models/publication');

/**
 * updateDomains Function
 * 
 * A database migration script that adds a 'domain' field to all Publication documents
 * that don't already have one. This is a one-time script to update the database schema.
 * 
 * @async
 * @function
 * @throws {Error} If there's an error connecting to MongoDB or updating documents
 * 
 * @description
 * This script:
 * 1. Connects to MongoDB using the URI from environment variables
 * 2. Updates all Publication documents that don't have a domain field
 * 3. Sets an empty string as the default value for the domain field
 * 4. Logs the number of documents updated
 * 5. Ensures proper database connection cleanup
 */
const updateDomains = async () => {
  try {
    // Connect to MongoDB using the URI from environment variables
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update all documents that don't have a domain field
    const result = await Publication.updateMany(
      { domain: { $exists: false } }, // Query: only match documents without domain field
      { $set: { domain: '' } }        // Update: add domain field with empty string
    );

    // Log the number of documents that were updated
    console.log(`Updated ${result.modifiedCount} documents`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
  } catch (err) {
    // Log any errors that occur during the update process
    console.error('Error updating domain fields:', err);
    // Ensure we disconnect even if there's an error
    await mongoose.disconnect();
  }
};

// Execute the update function
updateDomains();
