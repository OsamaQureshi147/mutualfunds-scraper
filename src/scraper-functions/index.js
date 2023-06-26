const { scrapeFundTypes } = require("./scrapeFundTypes");
const { scrapeCommonEntities } = require("./scrapeCommonEntities");
const { scrapeFunds } = require("./funds/scrapeFunds");
const { scrapePayouts } = require("./payouts/scrapePayouts");

module.exports = {
  scrapeFundTypes,
  scrapeCommonEntities,
  scrapeFunds,
  scrapePayouts,
};
