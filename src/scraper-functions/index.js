const { scrapeFunds } = require("./funds/scrapeFunds");
const { scrapeAMCs } = require("./scrapeAMCs");
const { scrapeFundCategories } = require("./scrapeFundCategories");
const { scrapeFundTypes } = require("./scrapeFundTypes");

const scrapeCommonEntities = async ({ page, browser }) => {
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

  const [amcsTable, fundCategoriesTable] = await Promise.all([
    amcsTablePromise,
    fundCategoriesTablePromise,
  ]);
  return { fundTypesTable, amcsTable, fundCategoriesTable };
};

module.exports = {
  scrapeCommonEntities,
  scrapeFunds,
};
