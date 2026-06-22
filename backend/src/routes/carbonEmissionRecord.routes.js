const express = require("express");

const {
  getCarbonEmissionRecords,
  getCarbonEmissionRecordById,
  createCarbonEmissionRecord,
  updateCarbonEmissionRecord,
  deleteCarbonEmissionRecord
} = require("../controllers/carbonEmissionRecord.controller");

const router = express.Router();

router.get("/", getCarbonEmissionRecords);
router.get("/:id", getCarbonEmissionRecordById);
router.post("/", createCarbonEmissionRecord);
router.put("/:id", updateCarbonEmissionRecord);
router.delete("/:id", deleteCarbonEmissionRecord);

module.exports = router;