const validateCarbonEmissionRecord = (req, res, next) => {
  const {
    location,
    period,
    totalEmissionsMt,
    emissionsIntensity,
    emissionsPerCapita,
    annualVariation
  } = req.body;

  const errors = [];

  if (!location || typeof location !== "string" || location.trim().length === 0) {
    errors.push("location is required and must be a non-empty string");
  }

  if (!Number.isInteger(period)) {
    errors.push("period is required and must be an integer");
  }

  if (period && (period < 1900 || period > new Date().getFullYear() + 1)) {
    errors.push("period must be a valid year");
  }

  if (typeof totalEmissionsMt !== "number" || totalEmissionsMt < 0) {
    errors.push("totalEmissionsMt is required and must be a positive number");
  }

  if (typeof emissionsIntensity !== "number" || emissionsIntensity < 0) {
    errors.push("emissionsIntensity is required and must be a positive number");
  }

  if (typeof emissionsPerCapita !== "number" || emissionsPerCapita < 0) {
    errors.push("emissionsPerCapita is required and must be a positive number");
  }

  if (typeof annualVariation !== "number") {
    errors.push("annualVariation is required and must be a number");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation error",
      errors
    });
  }

  next();
};

module.exports = validateCarbonEmissionRecord;