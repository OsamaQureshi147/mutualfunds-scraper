const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const { scrapeFundTypes } = require("./scraper-functions/scrapeFundTypes");
const { scrapeAMCs } = require("./scraper-functions/scrapeAMCs");
const {
  scrapeFundCategories,
} = require("./scraper-functions/scrapeFundCategories");

const { websiteUrl } = require("./constants");

const startScraping = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(websiteUrl);
  const fundTypesTable = await scrapeFundTypes({ page });
  const amcsTable = await scrapeAMCs({ page });
  const fundCategories = await scrapeFundCategories({ page });
  await browser.close();
  await fs.writeFile("fund-types.txt", JSON.stringify(fundTypesTable));
  await fs.writeFile("amcs.txt", JSON.stringify(amcsTable));
  await fs.writeFile("fund-categories.txt", JSON.stringify(fundCategories));
};
startScraping();
