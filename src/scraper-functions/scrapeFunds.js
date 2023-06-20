const { parseAbbreviation } = require("../utils");

const scrapeFunds = ({ page }) => {
  return new Promise((res, rej) => {
    (async () => {
      try {
        const fundType = await page.$eval("#sellink", (el) => el.textContent);
        const fundsTable = await page.$$eval(
          "table.mydata tr.border",
          (rows) => {
            const tabelHeaders = [
              "fundName",
              "category",
              "inceptionDate",
              "aum",
            ];
            return rows.map((row) => {
              // return the rows as JSON with key-value pairs
              let fundRecordObj = {};
              fundRecordObj["uid"] = row.id;
              const cells = Array.from(row.querySelectorAll("td"));
              cells.forEach((cell, i) => {
                fundRecordObj[tabelHeaders[i]] = cell.textContent.trim();
              });
              return fundRecordObj;
            });
          }
        );
        const formattedFundsTable = fundsTable.map((fundRecord) => {
          return {
            ...fundRecord,
            fundName: parseAbbreviation(fundRecord.fundName),
            category: parseAbbreviation(fundRecord.category),
            fundType: parseAbbreviation(fundType),
          };
        });
        console.log("Cells Data", formattedFundsTable);
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
