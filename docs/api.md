# API Documentation

## Project

**DGSIN-2526-10**

REST API and integration backend for the CO₂ emissions dashboard.

Deployed base URL:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com
```

Local base URL:

```txt
http://localhost:8080
```

---

# 1. API overview

The backend exposes two main API groups:

| API group | Base path | Description |
|---|---|---|
| Carbon emission records | `/api/v1/carbon-emission-records` | Own REST API backed by MongoDB Atlas |
| Integrations | `/api/v1/integrations` | Integration endpoints with external APIs |

The backend also serves the Angular production build from:

```txt
backend/public/
```

---

# 2. Health check

## GET `/api/v1/health`

Checks whether the API is running.

### Successful response

```http
200 OK
```

```json
{
  "status": "ok",
  "service": "carbon-emission-records-api",
  "version": "1.0.0"
}
```

---

# 3. Carbon emission records API

Base resource:

```txt
/api/v1/carbon-emission-records
```

This resource manages CO₂ emission records stored in MongoDB Atlas.

---

## 3.1. Data model

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | String | Yes | MongoDB ObjectId |
| `location` | String | Yes | Original location name from the dataset |
| `period` | Number | Yes | Year |
| `totalEmissionsMt` | Number | Yes | Total CO₂ emissions in megatonnes |
| `emissionsIntensity` | Number or null | No | Emissions intensity |
| `emissionsPerCapita` | Number | Yes | CO₂ emissions per capita |
| `annualVariation` | Number or null | No | Annual variation |

The fields `emissionsIntensity` and `annualVariation` may be `null` when the original source does not provide those values.

The combination of `location` and `period` must be unique.

---

## 3.2. GET collection

```http
GET /api/v1/carbon-emission-records
```

Returns a paginated list of records.

### Query parameters

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `location` | String | No | Flexible location filter |
| `period` | Number | No | Exact year |
| `fromPeriod` | Number | No | Start year |
| `toPeriod` | Number | No | End year |
| `limit` | Number | No | Page size |
| `offset` | Number | No | Pagination offset |

### Example request

```http
GET /api/v1/carbon-emission-records?location=Spain&fromPeriod=2020&toPeriod=2023&limit=50&offset=0
```

### Successful response

```http
200 OK
```

```json
{
  "total": 4,
  "limit": 50,
  "offset": 0,
  "records": [
    {
      "_id": "68585f4f5c93c6ab1f2c1234",
      "location": "Spain and Andorra",
      "period": 2022,
      "totalEmissionsMt": 235.471,
      "emissionsIntensity": 0.11,
      "emissionsPerCapita": 5.07,
      "annualVariation": -0.84
    }
  ]
}
```

---

## 3.3. POST collection

```http
POST /api/v1/carbon-emission-records
```

Creates a new record.

### Example request body

```json
{
  "location": "Spain and Andorra",
  "period": 2026,
  "totalEmissionsMt": 2,
  "emissionsIntensity": 2,
  "emissionsPerCapita": 21,
  "annualVariation": 2
}
```

### Successful response

```http
201 Created
```

```json
{
  "_id": "68585f4f5c93c6ab1f2c9999",
  "location": "Spain and Andorra",
  "period": 2026,
  "totalEmissionsMt": 2,
  "emissionsIntensity": 2,
  "emissionsPerCapita": 21,
  "annualVariation": 2
}
```

### Validation error

```http
400 Bad Request
```

```json
{
  "message": "Validation error",
  "errors": [
    "location is required",
    "period must be a valid year"
  ]
}
```

### Duplicate error

```http
409 Conflict
```

```json
{
  "message": "A carbon emission record already exists for this location and period"
}
```

---

## 3.4. DELETE collection

```http
DELETE /api/v1/carbon-emission-records
```

Deletes all records from the collection.

### Successful response

```http
200 OK
```

```json
{
  "message": "Carbon emission records deleted successfully",
  "deleted": 1200
}
```

---

## 3.5. GET one resource

```http
GET /api/v1/carbon-emission-records/:id
```

Returns one record by MongoDB ObjectId.

### Example request

```http
GET /api/v1/carbon-emission-records/68585f4f5c93c6ab1f2c1234
```

### Successful response

```http
200 OK
```

```json
{
  "_id": "68585f4f5c93c6ab1f2c1234",
  "location": "Spain and Andorra",
  "period": 2022,
  "totalEmissionsMt": 235.471,
  "emissionsIntensity": 0.11,
  "emissionsPerCapita": 5.07,
  "annualVariation": -0.84
}
```

### Not found

```http
404 Not Found
```

```json
{
  "message": "Carbon emission record not found"
}
```

---

## 3.6. PUT one resource

```http
PUT /api/v1/carbon-emission-records/:id
```

Updates one record.

### Example request body

```json
{
  "_id": "68585f4f5c93c6ab1f2c1234",
  "location": "Spain and Andorra",
  "period": 2026,
  "totalEmissionsMt": 3,
  "emissionsIntensity": null,
  "emissionsPerCapita": 22,
  "annualVariation": null
}
```

### Successful response

```http
200 OK
```

```json
{
  "_id": "68585f4f5c93c6ab1f2c1234",
  "location": "Spain and Andorra",
  "period": 2026,
  "totalEmissionsMt": 3,
  "emissionsIntensity": null,
  "emissionsPerCapita": 22,
  "annualVariation": null
}
```

### Wrong body id

If the request body contains an `_id` different from the URL resource id:

```http
400 Bad Request
```

```json
{
  "message": "The request body id must match the URL resource id"
}
```

### Duplicate conflict

If the update creates a duplicated `location` and `period` combination:

```http
409 Conflict
```

```json
{
  "message": "A carbon emission record already exists for this location and period"
}
```

### Not found

```http
404 Not Found
```

```json
{
  "message": "Carbon emission record not found"
}
```

---

## 3.7. DELETE one resource

```http
DELETE /api/v1/carbon-emission-records/:id
```

Deletes one record.

### Successful response

```http
200 OK
```

```json
{
  "message": "Carbon emission record deleted successfully"
}
```

### Not found

```http
404 Not Found
```

```json
{
  "message": "Carbon emission record not found"
}
```

---

## 3.8. GET available locations

```http
GET /api/v1/carbon-emission-records/locations
```

Returns the unique local locations stored in the dataset.

### Successful response

```http
200 OK
```

```json
{
  "total": 200,
  "locations": [
    "Afghanistan",
    "France and Monaco",
    "Spain and Andorra"
  ]
}
```

---

## 3.9. GET load initial data

```http
GET /api/v1/carbon-emission-records/loadInitialData
```

Loads the initial dataset only if the collection is empty.

### Loaded response

```http
201 Created
```

```json
{
  "message": "Initial carbon emission records loaded successfully",
  "loaded": true,
  "inserted": 1200,
  "total": 1200
}
```

### Already loaded response

```http
200 OK
```

```json
{
  "message": "Database already contains carbon emission records",
  "loaded": false,
  "inserted": 0,
  "total": 1200
}
```

---

## 3.10. GET Postman documentation redirect

```http
GET /api/v1/carbon-emission-records/docs
```

Redirects to the public Postman documentation portal.

### Response

```http
302 Found
```

Redirect target:

```txt
https://documenter.getpostman.com/view/15287747/2sBXwyF6od
```

---

## 3.11. Method not allowed

Known routes return `405 Method Not Allowed` when a non-supported HTTP method is used.

Example:

```http
PATCH /api/v1/carbon-emission-records
```

Response:

```http
405 Method Not Allowed
```

```json
{
  "message": "Method not allowed for this endpoint",
  "method": "PATCH",
  "path": "/api/v1/carbon-emission-records"
}
```

---

# 4. Integration API

Base path:

```txt
/api/v1/integrations
```

The integration API connects local CO₂ emission records with the external Ember Energy API.

---

## 4.1. GET supported locations

```http
GET /api/v1/integrations/supported-locations
```

Returns locations that can be matched between the local dataset and Ember Energy.

### Successful response

```http
200 OK
```

```json
{
  "total": 4,
  "locations": [
    {
      "label": "Spain",
      "emberEntity": "Spain",
      "localLocation": "Spain and Andorra"
    }
  ]
}
```

---

## 4.2. GET renewable electricity integration

```http
GET /api/v1/integrations/renewable-electricity
```

Returns integrated data from the local API and Ember Energy.

### Query parameters

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `location` | String | Yes | Selected supported location |
| `fromPeriod` | Number | Yes | Start year |
| `toPeriod` | Number | Yes | End year |

### Example request

```http
GET /api/v1/integrations/renewable-electricity?location=Spain&fromPeriod=2020&toPeriod=2023
```

### Successful response

```http
200 OK
```

```json
{
  "location": "Spain",
  "emberEntity": "Spain",
  "localLocation": "Spain and Andorra",
  "fromPeriod": 2020,
  "toPeriod": 2023,
  "emissions": [
    {
      "_id": "68585f4f5c93c6ab1f2c1234",
      "location": "Spain and Andorra",
      "period": 2022,
      "totalEmissionsMt": 235.471,
      "emissionsIntensity": 0.11,
      "emissionsPerCapita": 5.07,
      "annualVariation": -0.84
    }
  ],
  "electricityGeneration": [
    {
      "entity": "Spain",
      "year": 2022,
      "generation_twh": 280
    }
  ],
  "source": {
    "name": "Ember",
    "dataset": "Yearly electricity generation",
    "url": "https://ember-energy.org/data/yearly-electricity-data/",
    "license": "CC-BY-4.0"
  }
}
```

### Unsupported location

```http
400 Bad Request
```

```json
{
  "message": "Unsupported location for Ember integration",
  "location": "UnsupportedTestLocation",
  "supportedLocations": [
    "Spain",
    "France",
    "Germany"
  ]
}
```

---

# 5. Status codes summary

| Status code | Meaning | Used when |
|---:|---|---|
| `200 OK` | Successful request | GET, PUT, DELETE |
| `201 Created` | Resource created | POST or initial data loaded |
| `302 Found` | Redirect | Postman documentation route |
| `400 Bad Request` | Invalid request | Validation, wrong body id, unsupported location |
| `404 Not Found` | Resource not found | Missing record or route |
| `405 Method Not Allowed` | Unsupported method | Known route with wrong HTTP method |
| `409 Conflict` | Duplicate conflict | Existing `location` and `period` combination |
| `500 Internal Server Error` | Server error | Database or external API errors |

---

# 6. CORS and proxy

The backend enables CORS headers so the Angular frontend can consume the API.

The Ember Energy integration is implemented through a backend proxy:

```txt
Angular frontend -> Project backend -> Ember Energy API
```

This prevents exposing the external API key in the browser.
