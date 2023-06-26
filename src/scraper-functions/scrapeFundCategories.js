const { parseAbbreviation } = require("../utils.js");
const { funds_aum_url } = require("../constants");

const getCategoryColIndex = async ({ page }) => {
  let headerColumns = await page.$$eval(
    "table.mydata tr.tab-headings",
    (elements) => {
      const cells = Array.from(elements[0].querySelectorAll("td"));
      return cells.map((cell) => cell.textContent.trim());
    }
  );
  const categoryColIndex = headerColumns.findIndex((col) => col === "Category");
  return { categoryColIndex };
};

const scrapeFundCategories = ({ page, linksToScrape, browser }) => {
  return new Promise((res, rej) => {
    (async () => {
      try {
        // Find the index of Category Column
        const { categoryColIndex } = await getCategoryColIndex({ page });

        // fetch from the current page
        let fundCategories = await page.$$eval(
          `table.mydata tr.border td:nth-child(${categoryColIndex + 1})`,
          (elements) =>
            // we have isNaN check as there are sub tables with total and sub-total info rows
            elements.map((element) =>
              isNaN(element.textContent) ? element.textContent.trim() : null
            )
        );

        if (linksToScrape?.length) {
          for (const link of linksToScrape) {
            // avoid extra navigation
            if (link !== funds_aum_url) {
              const page = await browser.newPage();
              await page.goto(link);
              const { categoryColIndex } = await getCategoryColIndex({ page });
              fundCategories = [
                ...fundCategories,
                ...(await page.$$eval(
                  `table.mydata tr.border td:nth-child(${
                    categoryColIndex + 1
                  })`,
                  (elements) =>
                    elements.map((element) =>
                      isNaN(element.textContent)
                        ? element.textContent.trim()
                        : null
                    )
                )),
              ];
            }
          }
        }

        // Filter out unique categories and remove any falsy values
        const uniqueFundCategories = [...new Set(fundCategories)].filter(
          (category) => category
        );

        const fundCategoriesTable = uniqueFundCategories.map((fundCategory) => {
          return {
            uid: parseAbbreviation(fundCategory),
            name: fundCategory,
          };
        });

        res(fundCategoriesTable);
      } catch (error) {
        rej({ error: "Error scraping fund categories", cause: error });
      }
    })();
  });
};

module.exports = {
  scrapeFundCategories,
};
