const { parseAbbreviation } = require("../../utils");
const { websiteUrl } = require("../../constants");

const getFundsData = async ({ page }) => {
  const fundsTable = await page.$$eval("table.mydata tr", (rows) => {
    // div with id = sellink is current fundType.
    // It is basically the selected tab
    const fundType = document.getElementById("sellink")?.textContent.trim();

    const formattedFundsDataWithAMCs = [];

    // Need to filter the rows based on classLists.
    // The tr with "border" class consists of funds data
    // The tr with no class consists of the AMC which is required to develop the relation
    const fundsAndAmcsRows = rows.filter(
      (row) =>
        Object.values(row.classList).includes("border") ||
        !Object.values(row.classList).length
    );

    let currentAmc = "unknown";
    const tableHeadersConventional = [
      "fundName",
      "category",
      "inceptionDate",
      "aum",
      "amc",
    ];
    const tableHeadersForVPF = [
      "fundName",
      "subFund",
      "category",
      "inceptionDate",
      "aum",
      "amc",
    ];
    fundsAndAmcsRows.forEach((row) => {
      if (!Object.values(row.classList).length) {
        currentAmc = row.querySelector("td").textContent.trim();
        return;
      }
      // return the rows as JSON with key-value pairs
      let fundRecordObj = {
        uid: row.id,
        amc: currentAmc,
        fundType,
      };

      const tableHeaders =
        fundType === "Voluntary Pension Funds"
          ? tableHeadersForVPF
          : tableHeadersConventional;
      const cells = Array.from(row.querySelectorAll("td"));
      cells.forEach((cell, i) => {
        // In VPF, we have additional second column of sub type which we don't want in our schema right now
        if (fundType === "Voluntary Pension Funds" && i == 1) return;
        fundRecordObj[tableHeaders[i]] = cell.textContent.trim();
      });
      formattedFundsDataWithAMCs.push(fundRecordObj);
    });

    return formattedFundsDataWithAMCs;
  });
  return fundsTable;
};

const scrapeFunds = ({ page, browser, linksToScrape }) => {
  return new Promise((res, rej) => {
    (async () => {
      try {
        let fundsRecords = await getFundsData({ page });

        if (linksToScrape?.length) {
          for (const link of linksToScrape) {
            // avoid extra navigation
            if (link !== websiteUrl) {
              const page = await browser.newPage();
              await page.goto(link);
              const newPageFundRecords = await getFundsData({ page });
              fundsRecords = [...fundsRecords, ...newPageFundRecords];
            }
          }
        }

        const formattedFundsTable = fundsRecords.map((fundRecord) => {
          return {
            ...fundRecord,
            fundName: parseAbbreviation(fundRecord.fundName),
            category: parseAbbreviation(fundRecord.category),
            fundType: parseAbbreviation(fundRecord.fundType),
            amc: parseAbbreviation(fundRecord.amc),
          };
        });
        res(formattedFundsTable);
      } catch (error) {
        rej({ error: "Error scraping funds", cause: error });
      }
    })();
  });
};

module.exports = {
  scrapeFunds,
};
