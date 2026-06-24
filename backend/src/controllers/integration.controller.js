const CarbonEmissionRecord = require("../models/carbonEmissionRecord.model");

const {
  fetchYearlyElectricityGeneration,
  fetchYearlyElectricityEntityOptions
} = require("../services/emberEnergy.service");

const excludedEmberEntities = new Set([
  "ASEAN",
  "Africa",
  "Asia",
  "EU",
  "Europe",
  "G20",
  "G7",
  "Latin America and Caribbean",
  "Middle East",
  "North America",
  "OECD",
  "Oceania",
  "World"
]);

const localLocationAliases = {
  Spain: "Spain and Andorra",
  France: "France and Monaco",
  Italy: "Italy, San Marino and the Holy See",
  Switzerland: "Switzerland and Liechtenstein",
  Israel: "Israel and Palestine, State of",
  Sudan: "Sudan and South Sudan",
  "South Sudan": "Sudan and South Sudan",
  Serbia: "Serbia and Montenegro",
  Montenegro: "Serbia and Montenegro",
  Myanmar: "Myanmar/Burma",
  "The Philippines": "Philippines",
  "Tanzania (the United Republic of)": "Tanzania",
  "Sao Tome and Principe": "São Tomé and Príncipe",
  Reunion: "Réunion",
  Gambia: "The Gambia"
};

const normalizeEmberRecords = (emberResponse) => {
  if (Array.isArray(emberResponse?.data)) {
    return emberResponse.data;
  }

  if (Array.isArray(emberResponse?.results)) {
    return emberResponse.results;
  }

  if (Array.isArray(emberResponse)) {
    return emberResponse;
  }

  return [];
};

const normalizeEmberOptions = (emberOptionsResponse) => {
  if (Array.isArray(emberOptionsResponse?.options)) {
    return emberOptionsResponse.options;
  }

  if (Array.isArray(emberOptionsResponse?.data)) {
    return emberOptionsResponse.data;
  }

  if (Array.isArray(emberOptionsResponse)) {
    return emberOptionsResponse;
  }

  return [];
};

const normalizeText = (value) => {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const findExactLocalLocation = (emberEntity, localLocations) => {
  const alias = localLocationAliases[emberEntity];

  if (alias) {
    const aliasMatch = localLocations.find(
      (localLocation) => normalizeText(localLocation) === normalizeText(alias)
    );

    if (aliasMatch) {
      return aliasMatch;
    }
  }

  return (
    localLocations.find(
      (localLocation) => normalizeText(localLocation) === normalizeText(emberEntity)
    ) || null
  );
};

const buildCompatibleLocations = async () => {
  const emberOptionsResponse = await fetchYearlyElectricityEntityOptions();
  const emberEntities = normalizeEmberOptions(emberOptionsResponse);

  const localLocations = await CarbonEmissionRecord.distinct("location");

  return emberEntities
    .filter((emberEntity) => !excludedEmberEntities.has(emberEntity))
    .map((emberEntity) => {
      const localLocation = findExactLocalLocation(emberEntity, localLocations);

      if (!localLocation) {
        return null;
      }

      return {
        label: emberEntity,
        emberEntity,
        localLocation
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.label.localeCompare(b.label));
};

const getSupportedIntegrationLocations = async (req, res) => {
  try {
    const compatibleLocations = await buildCompatibleLocations();

    return res.status(200).json({
      total: compatibleLocations.length,
      locations: compatibleLocations
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving supported integration locations",
      error: error.message
    });
  }
};

const getRenewableElectricityIntegration = async (req, res) => {
  try {
    const { location = "Spain", fromPeriod = "2020", toPeriod = "2023" } = req.query;

    const compatibleLocations = await buildCompatibleLocations();

    const selectedLocation = compatibleLocations.find(
      (item) => normalizeText(item.label) === normalizeText(location)
    );

    if (!selectedLocation) {
      return res.status(400).json({
        message: "Unsupported location for Ember integration",
        location,
        supportedLocations: compatibleLocations.map((item) => item.label)
      });
    }

    const emissions = await CarbonEmissionRecord.find({
      location: selectedLocation.localLocation,
      period: {
        $gte: Number(fromPeriod),
        $lte: Number(toPeriod)
      }
    }).sort({ period: 1 });

    const emberResponse = await fetchYearlyElectricityGeneration({
      entity: selectedLocation.emberEntity,
      startDate: fromPeriod,
      endDate: toPeriod
    });

    const emberRecords = normalizeEmberRecords(emberResponse);

    return res.status(200).json({
      location: selectedLocation.label,
      emberEntity: selectedLocation.emberEntity,
      localLocation: selectedLocation.localLocation,
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
  getRenewableElectricityIntegration,
  getSupportedIntegrationLocations
};