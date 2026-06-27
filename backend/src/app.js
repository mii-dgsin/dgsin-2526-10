const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const carbonEmissionRecordRoutes = require("./routes/carbonEmissionRecord.routes");
const integrationRoutes = require("./routes/integration.routes");
const notFound = require("./middlewares/notFound.middleware");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.get("/api/v1", (req, res) => {
  res.status(200).json({
    message: "DGSIN-2526-10 API",
    version: "1.0.0",
    resources: {
      health: "/api/v1/health",
      carbonEmissionRecords: "/api/v1/carbon-emission-records",
      carbonEmissionRecordLocations: "/api/v1/carbon-emission-records/locations",
      loadInitialData: "/api/v1/carbon-emission-records/loadInitialData",
      postmanDocumentation: "/api/v1/carbon-emission-records/docs",
      supportedIntegrationLocations: "/api/v1/integrations/supported-locations",
      renewableElectricityIntegration: "/api/v1/integrations/renewable-electricity"
    }
  });
});

app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "ok",
    service: "carbon-emission-records-api",
    version: "1.0.0"
  });
});

app.use("/api/v1/carbon-emission-records", carbonEmissionRecordRoutes);
app.use("/api/v1/integrations", integrationRoutes);

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  return res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use(notFound);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});