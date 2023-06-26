const { parseAbbreviation } = require("../utils.js");

const scrapeFundTypes = ({ page }) => {
  return new Promise((res, rej) => {
    (async () => {
      try {
        const fundTypes = await page.$$eval("#tab, #sellink", (elements) =>
          elements.map((el) => {
            return { name: el.textContent, link: el.href };
          })
        );
        const fundTypesTable = fundTypes.map(({ name, link }) => {
          return {
            uid: parseAbbreviation(name),
            name,
            link,
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
