const initialCarbonEmissionRecords = require("../../data/carbonEmissionRecords.json");
const CarbonEmissionRecord = require("../models/carbonEmissionRecord.model");

const loadInitialCarbonEmissionRecords = async (req, res) => {
  try {
    const existingRecords = await CarbonEmissionRecord.countDocuments();

    if (existingRecords > 0) {
      return res.status(200).json({
        message: "Database already contains carbon emission records",
        loaded: false,
        inserted: 0,
        total: existingRecords
      });
    }

    const insertedRecords = await CarbonEmissionRecord.insertMany(
      initialCarbonEmissionRecords,
      {
        ordered: false
      }
    );

    return res.status(201).json({
      message: "Initial carbon emission records loaded successfully",
      loaded: true,
      inserted: insertedRecords.length,
      total: insertedRecords.length
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error loading initial carbon emission records",
      error: error.message
    });
  }
};

const getCarbonEmissionRecords = async (req, res) => {
  try {
    const {
      location,
      period,
      fromPeriod,
      toPeriod,
      limit = 50,
      offset = 0
    } = req.query;

  const filter = {};

  if (location) {
    filter.location = new RegExp(location, "i");
  }

  if (period) {
    filter.period = Number(period);
  }

  if (fromPeriod || toPeriod) {
    filter.period = {};

    if (fromPeriod) {
      filter.period.$gte = Number(fromPeriod);
    }

    if (toPeriod) {
      filter.period.$lte = Number(toPeriod);
    }
  }

    const records = await CarbonEmissionRecord.find(filter)
      .sort({ location: 1, period: 1 })
      .skip(Number(offset))
      .limit(Number(limit));

    const total = await CarbonEmissionRecord.countDocuments(filter);

    res.status(200).json({
      total,
      limit: Number(limit),
      offset: Number(offset),
      records
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving carbon emission records",
      error: error.message
    });
  }
};

const getCarbonEmissionRecordById = async (req, res) => {
  try {
    const record = await CarbonEmissionRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        message: "Carbon emission record not found"
      });
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving carbon emission record",
      error: error.message
    });
  }
};

const createCarbonEmissionRecord = async (req, res) => {
  try {
    const record = await CarbonEmissionRecord.create(req.body);

    res.status(201).json(record);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A carbon emission record already exists for this location and period"
      });
    }

    res.status(400).json({
      message: "Error creating carbon emission record",
      error: error.message
    });
  }
};

const updateCarbonEmissionRecord = async (req, res) => {
  try {
    const record = await CarbonEmissionRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!record) {
      return res.status(404).json({
        message: "Carbon emission record not found"
      });
    }

    res.status(200).json(record);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A carbon emission record already exists for this location and period"
      });
    }

    res.status(400).json({
      message: "Error updating carbon emission record",
      error: error.message
    });
  }
};

const deleteCarbonEmissionRecord = async (req, res) => {
  try {
    const record = await CarbonEmissionRecord.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({
        message: "Carbon emission record not found"
      });
    }

    res.status(200).json({
      message: "Carbon emission record deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting carbon emission record",
      error: error.message
    });
  }
};
const getCarbonEmissionRecordLocations = async (req, res) => {
  try {
    const locations = await CarbonEmissionRecord.distinct("location");

    const sortedLocations = locations
      .filter((location) => location && location.trim().length > 0)
      .sort((a, b) => a.localeCompare(b));

    return res.status(200).json({
      total: sortedLocations.length,
      locations: sortedLocations
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving carbon emission record locations",
      error: error.message
    });
  }
};

module.exports = {
  getCarbonEmissionRecords,
  getCarbonEmissionRecordById,
  getCarbonEmissionRecordLocations,
  createCarbonEmissionRecord,
  updateCarbonEmissionRecord,
  deleteCarbonEmissionRecord,
  loadInitialCarbonEmissionRecords
};