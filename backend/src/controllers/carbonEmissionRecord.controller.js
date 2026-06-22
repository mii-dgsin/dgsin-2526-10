const CarbonEmissionRecord = require("../models/carbonEmissionRecord.model");

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
    const locationRegex = new RegExp(location, "i");

    filter.$or = [
      { normalizedLocation: locationRegex },
      { location: locationRegex }
    ];
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
      .sort({ normalizedLocation: 1, period: 1 })
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

module.exports = {
  getCarbonEmissionRecords,
  getCarbonEmissionRecordById,
  createCarbonEmissionRecord,
  updateCarbonEmissionRecord,
  deleteCarbonEmissionRecord
};