const { scrapeTypes } = require("./scrapeTypes");
const { scrapeCommonEntities } = require("./scrapeCommonEntities");
const { scrapeFunds } = require("./funds/scrapeFunds");
const { scrapePayouts } = require("./payouts/scrapePayouts");

module.exports = {
  scrapeCommonEntities,
  scrapeFunds,
  scrapeTypes,
  scrapePayouts,
};
