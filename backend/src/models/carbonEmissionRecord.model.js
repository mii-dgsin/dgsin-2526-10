const mongoose = require("mongoose");

const carbonEmissionRecordSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
      trim: true
    },
    period: {
      type: Number,
      required: true,
      min: 1900
    },
    totalEmissionsMt: {
      type: Number,
      required: false,
      min: 0
    },
    emissionsIntensity: {
      type: Number,
      required: false,
      default: null,
      min: 0
    },
    emissionsPerCapita: {
      type: Number,
      required: false,
      min: 0
    },
    annualVariation: {
      type: Number,
      required: false,
      default: null,
    }
  },
  {
    timestamps: true
  }
);

carbonEmissionRecordSchema.index(
  { location: 1, period: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "CarbonEmissionRecord",
  carbonEmissionRecordSchema
);