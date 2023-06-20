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
            uid: parseAbbreviation(amc.trim()),
            name: amc.trim(),
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
