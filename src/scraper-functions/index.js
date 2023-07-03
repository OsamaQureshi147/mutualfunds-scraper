const { scrapeFundTypes } = require("./scrapeFundTypes");
const { scrapeCommonEntities } = require("./scrapeCommonEntities");
const { scrapeFunds } = require("./funds/scrapeFunds");
const { scrapePayouts } = require("./payouts/scrapePayouts");
const {
  scrapeAssetsDistribution,
} = require("./assetsDistribution/scrapeAssetsDistribution");

module.exports = {
  scrapeFundTypes,
  scrapeCommonEntities,
  scrapeFunds,
  scrapePayouts,
  scrapeAssetsDistribution,
};
