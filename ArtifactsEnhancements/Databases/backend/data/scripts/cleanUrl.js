/**
 * Takes a full URL (e.g. https://www.bbc.com/news) and returns just the clean domain (e.g. bbc.com)
 * @param {string} fullUrl
 * @returns {string|null} - The cleaned domain or null if the URL is invalid
 */
const cleanUrl = (fullUrl) => {
  try {
    // Ensure the input has a protocol so URL() doesn't fail
    const prefixedUrl = fullUrl.startsWith('http://') || fullUrl.startsWith('https://')
      ? fullUrl
      : `https://${fullUrl}`;

    const parsed = new URL(prefixedUrl);
    return parsed.hostname.replace(/^www\./, '');
  } catch (err) {
    console.error(`Could not clean URL: ${fullUrl}`);
    return null;
  }
};
  
module.exports = cleanUrl;
