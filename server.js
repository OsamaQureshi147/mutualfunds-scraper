const puppeteer = require("puppeteer");
const websiteUrl = "https://www.mufap.com.pk/aum_report.php?tab=01";

const start = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(websiteUrl);
  await page.waitForSelector(`#tab`);
  const nonSelectedFundTypeElements = await page.$$("#tab");
  const nonSelectedFundTypes = await Promise.all(
    nonSelectedFundTypeElements.map((nonSelectedFundTypeElement) =>
      page.evaluate((el) => el.textContent, nonSelectedFundTypeElement)
    )
  );
  const selectedFundTypeElement = await page.$("#sellink");
  const selectedFundType = await page.evaluate(
    (el) => el.textContent,
    selectedFundTypeElement
  );

  console.log("All funds", [...nonSelectedFundTypes, selectedFundType]);
  await browser.close();
};
start();
