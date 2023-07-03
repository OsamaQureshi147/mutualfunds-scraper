const { asset_distribution_baseurl } = require("../../constants");

const getAssetsDistributionData = async ({ page }) => {
  const { assetsDistributionTable } = await page.$$eval(
    "table.mydata tr",
    (rows) => {
      const tableHeaders = ["assetClass", "rupees", "percentage"];

      const tableDataStartIndex = rows.findIndex(
        (row) =>
          Object.values(row.classList).includes("tab-data") &&
          !Object.values(row.classList).includes("border")
      );

      // we need to exclude the rows with headers or some irrelevant information
      // exluding last row because it contains total
      const tableRows = rows.slice(tableDataStartIndex + 1, -1);

      let assetsDistributionTable = [];
      tableRows.forEach((row) => {
        let payoutRecordObj = {};
        const cells = Array.from(row.querySelectorAll("td"));
        cells.forEach((cell, i) => {
          payoutRecordObj[tableHeaders[i]] = cell.textContent
            .trim()
            .replace(/[()]/g, "");
        });
        assetsDistributionTable.push(payoutRecordObj);
      });

      return { assetsDistributionTable };
    }
  );
  return { assetsDistributionTable };
};

const scrapeAssetsDistribution = ({ browser, fundsWithReportIds }) => {
  console.log("Funds with report Ids", fundsWithReportIds.slice(0, 5));
  return new Promise((res, rej) => {
    (async () => {
      try {
        const page = await browser.newPage();
        await page.goto(asset_distribution_baseurl);
        let { assetsDistributionTable } = await getAssetsDistributionData({
          page,
        });
        assetsDistributionTable.forEach(
          (record) => (record.fundId = fundsWithReportIds[0].uid)
        );

        // if (linksToScrape?.length) {
        //   for (const link of linksToScrape) {
        //     // avoid extra navigation
        //     if (link !== payouts_url) {
        //       const page = await browser.newPage();
        //       await page.goto(link);
        //       const newPagePayoutsRecords = await getAssetsDistributionData({ page });
        //       payoutRecords = [...payoutRecords, ...newPagePayoutsRecords];
        //     }
        //   }
        // }

        res("assetsDistributionRecord");
      } catch (error) {
        rej({ error: "Error scraping funds", cause: error });
      }
    })();
  });
};

module.exports = {
  scrapeAssetsDistribution,
};
