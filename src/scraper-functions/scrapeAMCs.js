const { parseAbbreviation } = require("../utils.js");

const scrapeAMCs = ({ page }) => {
  return new Promise((res, rej) => {
    (async () => {
      try {
        const amcs = await page.$$eval(".amc", (elements) =>
          elements.map((el) => el.textContent)
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
