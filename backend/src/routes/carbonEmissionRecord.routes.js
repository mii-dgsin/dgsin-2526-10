const express = require("express");

const {
  getCarbonEmissionRecords,
  getCarbonEmissionRecordById,
  getCarbonEmissionRecordLocations,
  createCarbonEmissionRecord,
  updateCarbonEmissionRecord,
  deleteCarbonEmissionRecord,
  deleteCarbonEmissionRecords,
  loadInitialCarbonEmissionRecords,
  redirectCarbonEmissionRecordDocs
} = require("../controllers/carbonEmissionRecord.controller");

const validateCarbonEmissionRecord = require("../validators/carbonEmissionRecord.validator");

const router = express.Router();

const methodNotAllowed = (req, res) => {
  return res.status(405).json({
    message: "Method not allowed for this endpoint",
    method: req.method,
    path: req.originalUrl
  });
};

router
  .route("/")
  .get(getCarbonEmissionRecords)
  .post(validateCarbonEmissionRecord, createCarbonEmissionRecord)
  .delete(deleteCarbonEmissionRecords)
  .all(methodNotAllowed);

router
  .route("/loadInitialData")
  .get(loadInitialCarbonEmissionRecords)
  .all(methodNotAllowed);

router
  .route("/locations")
  .get(getCarbonEmissionRecordLocations)
  .all(methodNotAllowed);

router
  .route("/docs")
  .get(redirectCarbonEmissionRecordDocs)
  .all(methodNotAllowed);

router
  .route("/:id")
  .get(getCarbonEmissionRecordById)
  .put(validateCarbonEmissionRecord, updateCarbonEmissionRecord)
  .delete(deleteCarbonEmissionRecord)
  .all(methodNotAllowed);

module.exports = router;