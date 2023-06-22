const { parseAbbreviation } = require("../utils.js");
const { websiteUrl } = require("../constants");

const scrapeAMCs = ({ page, links, browser }) => {
  return new Promise((res, rej) => {
    (async () => {
      try {
        // fetch from the current page
        let amcs = await page.$$eval(".amc", (elements) =>
          elements.map((el) => el.textContent)
        );

        if (links.length) {
          for (const link of links) {
            // avoid extra navigation
            if (link !== websiteUrl) {
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

          const uniqueAMCs = [...new Set(amcs)];
          const amcsTable = uniqueAMCs.map((amc) => {
            return {
              uid: parseAbbreviation(amc.trim()),
              name: amc.trim(),
            };
          });
          res(amcsTable);
        }
      } catch (error) {
        rej("Error scraping AMCs");
      }
    })();
  });
};

module.exports = {
  scrapeAMCs,
};
