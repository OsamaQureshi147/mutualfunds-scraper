const { asset_distribution_baseurl } = require("../../constants");

const getAssetsDistributionData = async ({ page }) => {
  const { fundAssetDistributionTable } = await page.$$eval(
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

      let fundAssetDistributionTable = [];
      tableRows.forEach((row) => {
        let payoutRecordObj = {};
        const cells = Array.from(row.querySelectorAll("td"));
        cells.forEach((cell, i) => {
          payoutRecordObj[tableHeaders[i]] = cell.textContent
            .trim()
            .replace(/[()]/g, "");
        });
        fundAssetDistributionTable.push(payoutRecordObj);
      });

      return { fundAssetDistributionTable };
    }
  );
  return { fundAssetDistributionTable };
};

const scrapeAssetsDistribution = ({ browser, fundsWithReportIds }) => {
  // Funds having reportIds are scrapeable because rest are either NA or not published
  const scrapeableFunds = fundsWithReportIds.filter(({ reportId }) => reportId);
  console.log("scrapaAble Assets", scrapeableFunds);

  return new Promise((res, rej) => {
    (async () => {
      try {
        let assetDistributionTable = [];
        for (const scrapeableFund of scrapeableFunds) {
          const { uid, reportId } = scrapeableFund;
          const page = await browser.newPage();
          await page.goto(asset_distribution_baseurl + reportId);
          let { fundAssetDistributionTable } = await getAssetsDistributionData({
            page,
          });
          fundAssetDistributionTable.forEach((record) => (record.fundId = uid));
          assetDistributionTable = [
            ...assetDistributionTable,
            ...fundAssetDistributionTable,
          ];
        }

        res(assetDistributionTable);
      } catch (error) {
        rej({ error: "Error scraping funds", cause: error });
      }
    })();
  });
};

module.exports = {
  scrapeAssetsDistribution,
};
