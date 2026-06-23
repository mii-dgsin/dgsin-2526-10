const CarbonEmissionRecord = require("../models/carbonEmissionRecord.model");
const {
  fetchYearlyElectricityGeneration
} = require("../services/emberEnergy.service");

const countryCodeMap = {
  Spain: "ESP",
  France: "FRA",
  Germany: "DEU",
  Italy: "ITA",
  Portugal: "PRT",
  "United Kingdom": "GBR",
  "United States": "USA",
  China: "CHN",
  Japan: "JPN",
  Brazil: "BRA"
};

const getEntityCodeFromLocation = (location) => {
  if (!location) {
    return null;
  }

  if (countryCodeMap[location]) {
    return countryCodeMap[location];
  }

  if (location.toLowerCase().includes("spain")) {
    return "ESP";
  }

  return null;
};

const normalizeEmberRecords = (emberResponse) => {
  if (Array.isArray(emberResponse?.data)) {
    return emberResponse.data;
  }

  if (Array.isArray(emberResponse)) {
    return emberResponse;
  }

  return [];
};

const getRenewableElectricityIntegration = async (req, res) => {
  try {
    const { location = "Spain", fromPeriod = "2020", toPeriod = "2023" } = req.query;

    const entityCode = getEntityCodeFromLocation(location);

    if (!entityCode) {
      return res.status(400).json({
        message: "Unsupported location for Ember integration",
        supportedLocations: Object.keys(countryCodeMap)
      });
    }

    const emissions = await CarbonEmissionRecord.find({
      location: new RegExp(location, "i"),
      period: {
        $gte: Number(fromPeriod),
        $lte: Number(toPeriod)
      }
    }).sort({ period: 1 });

    const emberResponse = await fetchYearlyElectricityGeneration({
      entityCode,
      startDate: fromPeriod,
      endDate: toPeriod
    });

    const emberRecords = normalizeEmberRecords(emberResponse);

    return res.status(200).json({
      location,
      entityCode,
      fromPeriod: Number(fromPeriod),
      toPeriod: Number(toPeriod),
      emissions,
      electricityGeneration: emberRecords,
      source: {
        name: "Ember",
        dataset: "Yearly electricity generation",
        url: "https://ember-energy.org/data/yearly-electricity-data/",
        license: "CC-BY-4.0"
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving renewable electricity integration",
      error: error.message
    });
  }
};

module.exports = {
  getRenewableElectricityIntegration
};