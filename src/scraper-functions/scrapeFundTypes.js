const { parseAbbreviation } = require("../utils.js");

const scrapeFundTypes = ({ page }) => {
  return new Promise((res, rej) => {
    (async () => {
      try {
        const fundTypeElements = await page.$$("#tab, #sellink");
        const fundTypes = await Promise.all(
          fundTypeElements.map((fundTypeElement) =>
            page.evaluate((el) => {
              return { name: el.textContent, link: el.href };
            }, fundTypeElement)
          )
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
