const express = require("express");

const {
  getCarbonEmissionRecords,
  getCarbonEmissionRecordById,
  createCarbonEmissionRecord,
  updateCarbonEmissionRecord,
  deleteCarbonEmissionRecord
} = require("../controllers/carbonEmissionRecord.controller");

const validateCarbonEmissionRecord = require("../validators/carbonEmissionRecord.validator");

const router = express.Router();

router.get("/", getCarbonEmissionRecords);
router.get("/:id", getCarbonEmissionRecordById);
router.post("/", validateCarbonEmissionRecord, createCarbonEmissionRecord);
router.put("/:id", validateCarbonEmissionRecord, updateCarbonEmissionRecord);
router.delete("/:id", deleteCarbonEmissionRecord);

module.exports = router;