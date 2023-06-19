const { parseAbbreviation } = require("../utils.js");

const scrapeFundTypes = ({ page }) => {
  return new Promise((res, rej) => {
    (async () => {
      try {
        const fundTypeElements = await page.$$("#tab, #sellink");
        const fundTypes = await Promise.all(
          fundTypeElements.map((fundTypeElement) =>
            page.evaluate((el) => el.textContent, fundTypeElement)
          )
        );

        const fundTypesTable = fundTypes.map((fundType) => {
          return {
            name: fundType,
            uid: parseAbbreviation(fundType),
          };
        });

        res(fundTypesTable);
      } catch (error) {
        rej("Error scraping fund types");
      }
    })();
  });
};

module.exports = {
  scrapeFundTypes,
};
