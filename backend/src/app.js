const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const carbonEmissionRecordRoutes = require("./routes/carbonEmissionRecord.routes");
const notFound = require("./middlewares/notFound.middleware");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Carbon Emission Records API is running"
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

app.use(notFound);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});