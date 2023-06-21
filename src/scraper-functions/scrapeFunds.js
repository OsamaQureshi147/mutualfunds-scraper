const { parseAbbreviation } = require("../utils");

const scrapeFunds = ({ page }) => {
  return new Promise((res, rej) => {
    (async () => {
      try {
        const fundType = await page.$eval("#sellink", (el) => el.textContent);
        const fundsTable = await page.$$eval("table.mydata tr", (rows) => {
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
          fundsAndAmcsRows.forEach((row) => {
            const tableHeaders = [
              "fundName",
              "category",
              "inceptionDate",
              "aum",
              "amc",
            ];
            if (!Object.values(row.classList).length) {
              currentAmc = row.querySelector("td").textContent.trim();
              return;
            }
            // return the rows as JSON with key-value pairs
            let fundRecordObj = {};
            fundRecordObj["uid"] = row.id;
            fundRecordObj["amc"] = currentAmc;
            const cells = Array.from(row.querySelectorAll("td"));
            cells.forEach((cell, i) => {
              fundRecordObj[tableHeaders[i]] = cell.textContent.trim();
            });
            formattedFundsDataWithAMCs.push(fundRecordObj);
          });

          return formattedFundsDataWithAMCs;
        });

        const formattedFundsTable = fundsTable.map((fundRecord) => {
          return {
            ...fundRecord,
            fundName: parseAbbreviation(fundRecord.fundName),
            category: parseAbbreviation(fundRecord.category),
            fundType: parseAbbreviation(fundType),
            amc: parseAbbreviation(fundRecord.amc),
          };
        });
        res(formattedFundsTable);
      } catch (error) {
        rej("Error scraping funds");
      }
    })();
  });
};

module.exports = {
  scrapeFunds,
};
