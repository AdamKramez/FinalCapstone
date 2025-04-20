const Publication = require('../models/publication'); // Import the Mongoose model
const cleanUrl = require('../data/scripts/cleanUrl');         // Import the helper to extract root domains from full URLs

// Controller function for handling POST /api/search
const searchPublicationByUrl = async (req, res) => {
  // gets the `url` property from the JSON body of the request
  const url = req.body.url;
  console.log('Incoming search URL:', url); //debug statement to check the incoming url

  // Validate that the URL was provided
  if (!url) {
    return res.status(400).json({ error: 'URL is required' }); // Respond with 400 Bad Request
  }

  try {
    // Clean the incoming URL to extract just the domain (e.g., bbc.com)
    const domain = cleanUrl(url);

    // Query the database for a publication matching that domain
    const publication = await Publication.findOne({ domain });

    // If no match is found, respond with 404 Not Found
    if (!publication) {
      return res.status(404).json({ error: 'Publication not found' });
    }

    // Respond with the relevant data
    res.status(200).json({
      url,
      news_source: publication.news_source,
      type: publication.type,
      rating: publication.rating,
      rating_num: publication.rating_num,
      confidence_level: publication.confidence_level
    });
  } catch (err) {
    // Handle any server/database errors
    console.error('Error during search:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export the controller function
module.exports = {
  searchPublicationByUrl
};
