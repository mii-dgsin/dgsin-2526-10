const express = require("express");

const {
  getRenewableElectricityIntegration,
  getSupportedIntegrationLocations
} = require("../controllers/integration.controller");

const router = express.Router();

router.get("/supported-locations", getSupportedIntegrationLocations);

router.get("/renewable-electricity", getRenewableElectricityIntegration);

module.exports = router;