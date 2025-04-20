// puppeteer-extra is a wrapper for puppeteer that allows plugins
const puppeteer = require('puppeteer-extra');

// This plugin helps bypass anti-bot protections like Cloudflare
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

/**
 * Scrapes the official website URL from an AllSides media bias page.
 * @param {string} allsidesUrl - The AllSides page URL (e.g. https://www.allsides.com/news-source/cbs-news-media-bias)
 * @returns {Promise<string|null>} - The extracted site URL or null if failed
 */
const scrapeWebsiteUrl = async (allsidesUrl) => {
  let browser;

  try {
    // Launch Puppeteer browser in headless mode
    browser = await puppeteer.launch({ headless: true });

    // Create a new page/tab in the browser
    const page = await browser.newPage();

    console.log(`🌐 Navigating to: ${allsidesUrl}`);

    // Navigate to the provided AllSides URL
    await page.goto(allsidesUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for the table row containing "Website" to appear
    await page.waitForSelector('td');

    // Extract the website URL from the page
    const url = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tr'));
      for (const row of rows) {
        const label = row.querySelector('td')?.textContent?.trim();
        if (label === 'Website') {
          return row.querySelector('a')?.href || null;
        }
      }
      return null;
    });

    return url;
  } catch (error) {
    console.error(`❌ Scraping failed for ${allsidesUrl}:`, error.message);
    return null;
  } finally {
    // Ensure the browser closes even on error
    if (browser) await browser.close();
  }
};

module.exports = scrapeWebsiteUrl;
