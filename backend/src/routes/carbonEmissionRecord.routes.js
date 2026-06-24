const express = require("express");

const {
  getCarbonEmissionRecords,
  getCarbonEmissionRecordById,
  getCarbonEmissionRecordLocations,
  createCarbonEmissionRecord,
  updateCarbonEmissionRecord,
  deleteCarbonEmissionRecord,
  loadInitialCarbonEmissionRecords
} = require("../controllers/carbonEmissionRecord.controller");

const validateCarbonEmissionRecord = require("../validators/carbonEmissionRecord.validator");

const router = express.Router();

router.get("/", getCarbonEmissionRecords);
router.get("/loadInitialData", loadInitialCarbonEmissionRecords);
router.get("/locations", getCarbonEmissionRecordLocations);
router.get("/:id", getCarbonEmissionRecordById);

router.post("/", validateCarbonEmissionRecord, createCarbonEmissionRecord);
router.put("/:id", validateCarbonEmissionRecord, updateCarbonEmissionRecord);
router.delete("/:id", deleteCarbonEmissionRecord);

module.exports = router;