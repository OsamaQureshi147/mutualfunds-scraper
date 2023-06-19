const { parseAbbreviation } = require("../utils.js");

const scrapFundTypes = ({ page }) => {
  return new Promise((res, rej) => {
    (async () => {
      try {
        const nonSelectedFundTypeElements = await page.$$("#tab");
        const nonSelectedFundTypes = await Promise.all(
          nonSelectedFundTypeElements.map((nonSelectedFundTypeElement) =>
            page.evaluate((el) => el.textContent, nonSelectedFundTypeElement)
          )
        );
        const selectedFundTypeElement = await page.$("#sellink");
        const selectedFundType = await page.evaluate(
          (el) => el.textContent,
          selectedFundTypeElement
        );

        const allFundTypes = [...nonSelectedFundTypes, selectedFundType];
        const fundTypesTable = allFundTypes.map((fundType) => {
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
  scrapFundTypes,
};
