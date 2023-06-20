const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const { scrapeFundTypes } = require("./scraper-functions/scrapeFundTypes");
const { scrapeAMCs } = require("./scraper-functions/scrapeAMCs");
const { websiteUrl } = require("./constants");

const startScraping = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(websiteUrl);
  const fundTypesTable = await scrapeFundTypes({ page });
  const amcsTable = await scrapeAMCs({ page });
  await fs.writeFile("fund-types.txt", JSON.stringify(fundTypesTable));
  await fs.writeFile("amcs.txt", JSON.stringify(amcsTable));
  await browser.close();
};
startScraping();
