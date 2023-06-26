const { parseAbbreviation } = require("../utils.js");
const { funds_aum_url } = require("../constants");

const scrapeAMCs = ({ page, linksToScrape, browser }) => {
  return new Promise((res, rej) => {
    (async () => {
      try {
        // fetch from the current page
        let amcs = await page.$$eval(".amc", (elements) =>
          elements.map((el) => el.textContent)
        );

        if (linksToScrape?.length) {
          for (const link of linksToScrape) {
            // avoid extra navigation
            if (link !== funds_aum_url) {
              const page = await browser.newPage();
              await page.goto(link);
              amcs = [
                ...amcs,
                ...(await page.$$eval(".amc", (elements) =>
                  elements.map((el) => el.textContent)
                )),
              ];
            }
          }
        }
        const uniqueAMCs = [...new Set(amcs)];
        const amcsTable = uniqueAMCs.map((amc) => {
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
