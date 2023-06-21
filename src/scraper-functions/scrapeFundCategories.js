const { parseAbbreviation } = require("../utils.js");

const scrapeFundCategories = ({ page }) => {
  return new Promise((res, rej) => {
    (async () => {
      try {
        const fundCategories = await page.$$eval(
          "table.mydata tr.border td:nth-child(2)",
          (elements) =>
            elements.map((element) =>
              isNaN(element.textContent) ? element.textContent : null
            )
        );
        const uniqueFundCategories = [...new Set(fundCategories)];
        const fundCategoriesTable = uniqueFundCategories.map((fundCategory) => {
          return {
            uid: parseAbbreviation(fundCategory),
            name: fundCategory,
          };
        });

        res(fundCategoriesTable);
      } catch (error) {
        rej("Error scraping fund categories");
      }
    })();
  });
};

module.exports = {
  scrapeFundCategories,
};
