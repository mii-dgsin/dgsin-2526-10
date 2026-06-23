const express = require("express");

const {
  getRenewableElectricityIntegration
} = require("../controllers/integration.controller");

const router = express.Router();

router.get("/renewable-electricity", getRenewableElectricityIntegration);

module.exports = router;