const puppeteer = require("puppeteer");
const fs = require("fs/promises");

const { aum_report_url, payout_url } = require("./constants");
const {
  scrapeCommonEntities,
  scrapeFunds,
  scrapeFundTypes,
} = require("./scraper-functions");

const startScraping = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(aum_report_url);
  const fundTypes = await scrapeFundTypes({ page });
  const { amcsTable, fundCategoriesTable } = await scrapeCommonEntities({
    page,
    browser,
    linksToScrape: fundTypes?.map(({ link }) => link),
  });
  const fundsTable = await scrapeFunds({
    page,
    browser,
    linksToScrape: fundTypes?.map(({ link }) => link),
  });

  // start scraping for payouts
  await page.goto(payout_url);
  const payoutFundTypes = await scrapeFundTypes({ page });

  console.log("Payout funds type", payoutFundTypes);

  await browser.close();

  await fs.writeFile("fund-types.txt", JSON.stringify(fundTypes));
  await fs.writeFile("amcs.txt", JSON.stringify(amcsTable));
  await fs.writeFile(
    "fund-categories.txt",
    JSON.stringify(fundCategoriesTable)
  );
  await fs.writeFile("funds.txt", JSON.stringify(fundsTable));
};
startScraping();
