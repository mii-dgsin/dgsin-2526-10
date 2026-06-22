const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

const CarbonEmissionRecord = require("../models/carbonEmissionRecord.model");

dotenv.config();

const records = require(path.join(
  __dirname,
  "../../data/carbonEmissionRecords.json"
));

const loadCarbonEmissionRecords = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    for (const record of records) {
      await CarbonEmissionRecord.findOneAndUpdate(
        {
          location: record.location,
          period: record.period
        },
        record,
        {
          upsert: true,
          returnDocument: "after",
          runValidators: true
        }
      );
    }

    console.log("Carbon emission records loaded successfully");
    console.log(`Total records processed: ${records.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error loading carbon emission records:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

loadCarbonEmissionRecords();