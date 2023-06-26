const puppeteer = require("puppeteer");
const fs = require("fs/promises");

const { funds_aum_url } = require("./constants");
const {
  scrapeCommonEntities,
  scrapeFunds,
  scrapeTypes,
  scrapePayouts,
} = require("./scraper-functions");

const startScraping = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(funds_aum_url);
  const fundTypes = await scrapeTypes({ page });
  const { amcsTable, fundCategoriesTable } = await scrapeCommonEntities({
    page,
    browser,
    linksToScrape: fundTypes?.map(({ link }) => link),
  });

  // scrape for Funds
  const fundsTable = await scrapeFunds({
    page,
    browser,
    linksToScrape: fundTypes?.map(({ link }) => link),
  });

  // start scraping for Payouts
  const payoutsTable = await scrapePayouts({ page, browser });

  await browser.close();

  await fs.writeFile("fund-types.txt", JSON.stringify(fundTypes));
  await fs.writeFile("amcs.txt", JSON.stringify(amcsTable));
  await fs.writeFile(
    "fund-categories.txt",
    JSON.stringify(fundCategoriesTable)
  );
  await fs.writeFile("funds.txt", JSON.stringify(fundsTable));
  await fs.writeFile("payouts.txt", JSON.stringify(payoutsTable));
};
startScraping();
