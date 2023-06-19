const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const { scrapFundTypes } = require("./scraper-functions/scrapeFundTypes");
const { websiteUrl } = require("./constants");

const start = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(websiteUrl);
  const fundTypes = await scrapFundTypes({ page });
  await fs.writeFile("fund-types.txt", JSON.stringify(fundTypes));
  console.log("Fund Types", fundTypes);
  await browser.close();
};
start();
