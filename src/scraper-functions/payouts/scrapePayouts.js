const { parseAbbreviation } = require("../../utils");
const { payouts_url } = require("../../constants");

const getPayoutsData = async ({ page }) => {
  const payoutsTable = await page.$$eval("table.mydata tr", (rows) => {
    // div with id = sellink is current fundType.
    // It is basically the selected tab
    const fundType = document.getElementById("sellink")?.textContent.trim();

    const formattedPayoutsDataWithAMCs = [];

    // Need to filter the rows based on classLists.
    // The tr with "border" class consists of funds data
    // The tr with no class consists of the AMC which is required to develop the relation
    const payoutsAndAmcsRows = rows.filter(
      (row) =>
        Object.values(row.classList).includes("border") ||
        !Object.values(row.classList).length
    );

    let currentAmc = "unknown";
    const tableHeaders = [
      "fundName",
      "category",
      "inceptionDate",
      "payout_per_unit",
      "ex_nav",
      "payout_date",
    ];

    payoutsAndAmcsRows.forEach((row) => {
      if (!Object.values(row.classList).length) {
        currentAmc = row.querySelector("td").textContent.trim();
        return;
      }
      // return the rows as JSON with key-value pairs
      let payoutRecordObj = {
        amc: currentAmc,
        fundType,
      };

      const cells = Array.from(row.querySelectorAll("td"));
      cells.forEach((cell, i) => {
        payoutRecordObj[tableHeaders[i]] = cell.textContent.trim();
      });
      formattedPayoutsDataWithAMCs.push(payoutRecordObj);
    });

    return formattedPayoutsDataWithAMCs;
  });
  return payoutsTable;
};

const scrapePayouts = ({ page, browser, linksToScrape }) => {
  return new Promise((res, rej) => {
    (async () => {
      try {
        let payoutRecords = await getPayoutsData({ page });

        if (linksToScrape?.length) {
          for (const link of linksToScrape) {
            // avoid extra navigation
            if (link !== payouts_url) {
              const page = await browser.newPage();
              await page.goto(link);
              const newPagePayoutsRecords = await getPayoutsData({ page });
              payoutRecords = [...payoutRecords, ...newPagePayoutsRecords];
            }
          }
        }

        const formattedPayoutsTable = payoutRecords.map((payoutRecord) => {
          return {
            ...payoutRecord,
            fundName: parseAbbreviation(payoutRecord.fundName),
            category: parseAbbreviation(payoutRecord.category),
            // fundType: parseAbbreviation(payoutRecord.fundType),
            // amc: parseAbbreviation(payoutRecord.amc),
          };
        });
        res(formattedPayoutsTable);
      } catch (error) {
        rej({ error: "Error scraping funds", cause: error });
      }
    })();
  });
};

module.exports = {
  scrapePayouts,
};
