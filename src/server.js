const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const { scrapeFundTypes } = require("./scraper-functions/scrapeFundTypes");
const { scrapeAMCs } = require("./scraper-functions/scrapeAMCs");
const {
  scrapeFundCategories,
} = require("./scraper-functions/scrapeFundCategories");
const { scrapeFunds } = require("./scraper-functions/funds/scrapeFunds");

const { websiteUrl } = require("./constants");

const startScraping = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(websiteUrl);

  const fundTypesTable = await scrapeFundTypes({ page });

  const amcsTablePromise = scrapeAMCs({
    page,
    browser,
    linksToScrape: fundTypesTable?.map(({ link }) => link),
  });

  const fundCategoriesTablePromise = scrapeFundCategories({
    page,
    browser,
    linksToScrape: fundTypesTable?.map(({ link }) => link),
  });

  const fundsTablePromise = scrapeFunds({
    page,
    browser,
    linksToScrape: fundTypesTable?.map(({ link }) => link),
  });

  const [amcsTable, fundCategoriesTable, fundsTable] = await Promise.all([
    amcsTablePromise,
    fundCategoriesTablePromise,
    fundsTablePromise,
  ]);

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
