const puppeteer = require("puppeteer");
const fs = require("fs/promises");

const { funds_aum_url, payouts_url } = require("./constants");
const {
  // scrapeCommonEntities,
  // scrapeFunds,
  scrapePayouts,
  scrapeFundTypes,
} = require("./scraper-functions");

const startScraping = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(funds_aum_url);
  // const fundTypes = await scrapeFundTypes({ page });
  // const { amcsTable, fundCategoriesTable } = await scrapeCommonEntities({
  //   page,
  //   browser,
  //   linksToScrape: fundTypes?.map(({ link }) => link),
  // });

  // // scrape for Funds
  // const fundsTable = await scrapeFunds({
  //   page,
  //   browser,
  //   linksToScrape: fundTypes?.map(({ link }) => link),
  // });

  // start scraping for Payouts
  await page.goto(payouts_url);
  const payoutFundTypes = await scrapeFundTypes({ page });
  const payoutsTable = await scrapePayouts({
    page,
    browser,
    linksToScrape: payoutFundTypes?.map(({ link }) => link),
  });

  await browser.close();

  // await fs.writeFile("fund-types.txt", JSON.stringify(fundTypes));
  // await fs.writeFile("amcs.txt", JSON.stringify(amcsTable));
  // await fs.writeFile(
  //   "fund-categories.txt",
  //   JSON.stringify(fundCategoriesTable)
  // );
  // await fs.writeFile("funds.txt", JSON.stringify(fundsTable));
  await fs.writeFile("payouts.txt", JSON.stringify(payoutsTable));
};
startScraping();
