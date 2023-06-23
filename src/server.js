const puppeteer = require("puppeteer");
const fs = require("fs/promises");

const { aum_report_url } = require("./constants");
const { scrapeCommonEntities, scrapeFunds } = require("./scraper-functions");

const startScraping = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(aum_report_url);
  const { fundTypesTable, amcsTable, fundCategoriesTable } =
    await scrapeCommonEntities({ page, browser });
  const fundsTable = await scrapeFunds({
    page,
    browser,
    linksToScrape: fundTypesTable?.map(({ link }) => link),
  });

  await browser.close();

  await fs.writeFile("fund-types.txt", JSON.stringify(fundTypesTable));
  await fs.writeFile("amcs.txt", JSON.stringify(amcsTable));
  await fs.writeFile(
    "fund-categories.txt",
    JSON.stringify(fundCategoriesTable)
  );
  await fs.writeFile("funds.txt", JSON.stringify(fundsTable));
};
startScraping();
