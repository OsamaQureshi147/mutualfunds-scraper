const { parseAbbreviation } = require("../../utils");
const { funds_aum_url } = require("../../constants");

const getFundsData = async ({ page }) => {
  const fundsTable = await page.$$eval("table.mydata tr", (rows) => {
    const getRecordIdFromHrefValue = ({ hrefValue }) => {
      let reportId;
      if (!hrefValue) {
        reportId = null;
      } else {
        const pattern = /'(.*?)'/g; //regex to extract reportId from href which is inside the single quotes
        const matches = hrefValue.matchAll(pattern);
        reportId = Array.from(matches, (match) => match[1])[0];
      }
      return { reportId };
    };

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

      // scrape the report_id, which will be used in scraping asset_classes_distribution
      const anchorElement = row.querySelector(`td#aanum${row.id} > a`);
      const hrefAttribute = anchorElement
        ? anchorElement.getAttribute("href")
        : null;
      const { reportId } = getRecordIdFromHrefValue({
        hrefValue: hrefAttribute,
      });

      // return the rows as JSON with key-value pairs
      let fundRecordObj = {
        uid: row.id,
        amc: currentAmc,
        fundType,
        reportId,
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
            if (link !== funds_aum_url) {
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
