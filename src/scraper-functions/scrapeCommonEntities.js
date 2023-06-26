const { scrapeAMCs } = require("./scrapeAMCs");
const { scrapeFundCategories } = require("./scrapeFundCategories");

const scrapeCommonEntities = async ({ page, browser, linksToScrape }) => {
  const amcsTablePromise = scrapeAMCs({
    page,
    browser,
    linksToScrape,
  });

  const fundCategoriesTablePromise = scrapeFundCategories({
    page,
    browser,
    linksToScrape,
  });

  const [amcsTable, fundCategoriesTable] = await Promise.all([
    amcsTablePromise,
    fundCategoriesTablePromise,
  ]);
  return { amcsTable, fundCategoriesTable };
};

module.exports = { scrapeCommonEntities };
