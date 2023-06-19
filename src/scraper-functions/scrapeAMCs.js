const { parseAbbreviation } = require("../utils.js");

const scrapeAMCs = ({ page }) => {
  return new Promise((res, rej) => {
    (async () => {
      try {
        const amcElements = await page.$$(".amc");
        const amcs = await Promise.all(
          amcElements.map((amcElement) =>
            page.evaluate((el) => el.textContent, amcElement)
          )
        );
        const amcsTable = amcs.map((amc) => {
          return {
            name: amc.slice(1),
            uid: parseAbbreviation(amc.slice(1)),
          };
        });
        res(amcsTable);
      } catch (error) {
        rej("Error scraping AMCs");
      }
    })();
  });
};

module.exports = {
  scrapeAMCs,
};
