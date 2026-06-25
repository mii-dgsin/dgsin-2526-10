# API Documentation

## Project

**DGSIN-2526-10**

Cloud information system for managing and visualizing CO₂ emission records and integrating them with external yearly electricity generation data from Ember Energy.

## Base URL

### Local development

```txt
http://localhost:8080
```

### Deployed API

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com
```

---

# 1. Carbon Emission Records API

The main API resource is:

```txt
/api/v1/carbon-emission-records
```

This API manages CO₂ emission records stored in MongoDB Atlas.

Each record represents the CO₂ emissions of a location in a specific year.

---

## 1.1. Data model

| Field                | Type           | Required | Description                                    |
| -------------------- | -------------- | -------: | ---------------------------------------------- |
| `_id`                | String         |      Yes | MongoDB identifier                             |
| `location`           | String         |      Yes | Original location name from the source dataset |
| `period`             | Number         |      Yes | Year of the record                             |
| `totalEmissionsMt`   | Number         |      Yes | Total CO₂ emissions in megatonnes              |
| `emissionsIntensity` | Number or null |       No | Emissions intensity                            |
| `emissionsPerCapita` | Number         |      Yes | CO₂ emissions per capita                       |
| `annualVariation`    | Number or null |       No | Annual variation of CO₂ emissions              |

The combination of `location` and `period` must be unique.

Some fields can be `null` because the original source does not always provide all values. This is especially relevant for `emissionsIntensity` and `annualVariation`.

Example:

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

---

# 2. Endpoints

## 2.1. Health check

```http
GET /api/v1/health
```

Checks whether the API is running.

### Successful response

Status code:

```txt
200 OK
```

Example response:

```json
{
  "status": "ok",
  "service": "carbon-emission-records-api",
  "version": "1.0.0"
}
```

---

## 2.2. Get all carbon emission records

```http
GET /api/v1/carbon-emission-records
```

Returns a paginated list of CO₂ emission records.

### Query parameters

| Parameter    | Type   | Required | Description                                       |
| ------------ | ------ | -------: | ------------------------------------------------- |
| `location`   | String |       No | Filters records by location using flexible search |
| `period`     | Number |       No | Filters records by exact year                     |
| `fromPeriod` | Number |       No | Filters records from this year                    |
| `toPeriod`   | Number |       No | Filters records up to this year                   |
| `limit`      | Number |       No | Maximum number of records returned                |
| `offset`     | Number |       No | Number of records skipped for pagination          |

### Example request

```http
GET /api/v1/carbon-emission-records?location=Spain&fromPeriod=2020&toPeriod=2023&limit=50&offset=0
```

### Successful response

Status code:

```txt
200 OK
```

Example response:

```json
{
  "total": 4,
  "limit": 50,
  "offset": 0,
  "records": [
    {
      "_id": "68585f4f5c93c6ab1f2c1234",
      "location": "Spain and Andorra",
      "period": 2020,
      "totalEmissionsMt": 215.921,
      "emissionsIntensity": 0.1,
      "emissionsPerCapita": 4.63,
      "annualVariation": -12.32
    }
  ]
}
```

### Notes

The location filter is flexible. For example:

```http
GET /api/v1/carbon-emission-records?location=Spain
```

can return records whose original location is:

```txt
Spain and Andorra
```

---

## 2.3. Get one carbon emission record by ID

```http
GET /api/v1/carbon-emission-records/:id
```

Returns one CO₂ emission record by MongoDB ID.

### Example request

```http
GET /api/v1/carbon-emission-records/68585f4f5c93c6ab1f2c1234
```

### Successful response

Status code:

```txt
200 OK
```

Example response:

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

### Error response

Status code:

```txt
404 Not Found
```

Example response:

```json
{
  "message": "Carbon emission record not found"
}
```

---

## 2.4. Create a carbon emission record

```http
POST /api/v1/carbon-emission-records
```

Creates a new CO₂ emission record.

### Request body

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

Status code:

```txt
201 Created
```

Example response:

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

Status code:

```txt
400 Bad Request
```

Example response:

```json
{
  "message": "Validation error",
  "errors": [
    "location is required",
    "period must be a valid year"
  ]
}
```

### Duplicate record error

Status code:

```txt
409 Conflict
```

Example response:

```json
{
  "message": "A carbon emission record already exists for this location and period"
}
```

---

## 2.5. Update a carbon emission record

```http
PUT /api/v1/carbon-emission-records/:id
```

Updates an existing CO₂ emission record.

### Example request

```http
PUT /api/v1/carbon-emission-records/68585f4f5c93c6ab1f2c1234
```

### Request body

```json
{
  "location": "Spain and Andorra",
  "period": 2026,
  "totalEmissionsMt": 3,
  "emissionsIntensity": null,
  "emissionsPerCapita": 22,
  "annualVariation": null
}
```

### Successful response

Status code:

```txt
200 OK
```

Example response:

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

### Error responses

If the record does not exist:

```txt
404 Not Found
```

```json
{
  "message": "Carbon emission record not found"
}
```

If the update creates a duplicate `location` and `period` combination:

```txt
409 Conflict
```

```json
{
  "message": "A carbon emission record already exists for this location and period"
}
```

---

## 2.6. Delete a carbon emission record

```http
DELETE /api/v1/carbon-emission-records/:id
```

Deletes an existing CO₂ emission record.

### Example request

```http
DELETE /api/v1/carbon-emission-records/68585f4f5c93c6ab1f2c1234
```

### Successful response

Status code:

```txt
200 OK
```

Example response:
```json
{
  "message": "Carbon emission record deleted successfully"
}
```

### Error response

Status code:

```txt
404 Not Found
```

Example response:

```json
{
  "message": "Carbon emission record not found"
}
```

---

## 2.7. Get available local locations

```http
GET /api/v1/carbon-emission-records/locations
```

Returns the unique locations available in the local CO₂ emissions dataset.

This endpoint is used by the frontend to provide location suggestions.

### Successful response

Status code:

```txt
200 OK
```

Example response:

```json
{
  "total": 200,
  "locations": [
    "Afghanistan",
    "Albania",
    "Spain and Andorra"
  ]
}
```

---

## 2.8. Load initial data if collection is empty

```http
GET /api/v1/carbon-emission-records/loadInitialData
```

Loads the initial CO₂ emission records from:

```txt
backend/data/carbonEmissionRecords.json
```

This route only inserts data if the MongoDB collection is empty.

### Successful response when data is loaded

Status code:

```txt
201 Created
```

Example response:

```json
{
  "message": "Initial carbon emission records loaded successfully",
  "loaded": true,
  "inserted": 1200,
  "total": 1200
}
```

### Successful response when collection already has data

Status code:

```txt
200 OK
```

Example response:

```json
{
  "message": "Database already contains carbon emission records",
  "loaded": false,
  "inserted": 0,
  "total": 1200
}
```

---

# 3. Integration API

The integration API resource is:

```txt
/api/v1/integrations
```

This API connects the local CO₂ emissions dataset with the external Ember Energy API.

The frontend does not call Ember directly. The backend acts as a proxy, which avoids exposing the Ember API key in Angular.

---

## 3.1. Get supported integration locations

```http
GET /api/v1/integrations/supported-locations
```

Returns the locations that are compatible between the local CO₂ emissions dataset and the Ember Energy API.

The backend obtains the list of available entities from Ember Energy and crosses it with the locations available in MongoDB.

To avoid incorrect matches, the backend uses normalized exact matching and controlled aliases for special cases where the local source groups several territories together.

### Example controlled aliases

| Ember entity | Local CO₂ dataset location         |
| ------------ | ---------------------------------- |
| Spain        | Spain and Andorra                  |
| France       | France and Monaco                  |
| Italy        | Italy, San Marino and the Holy See |
| Switzerland  | Switzerland and Liechtenstein      |
| Israel       | Israel and Palestine, State of     |

### Successful response

Status code:

```txt
200 OK
```

Example response:

```json
{
  "total": 150,
  "locations": [
    {
      "label": "Spain",
      "emberEntity": "Spain",
      "localLocation": "Spain and Andorra"
    },
    {
      "label": "France",
      "emberEntity": "France",
      "localLocation": "France and Monaco"
    }
  ]
}
```

### Error response

Status code:

```txt
500 Internal Server Error
```

Example response:

```json
{
  "message": "Error retrieving supported integration locations",
  "error": "EMBER_API_KEY is not defined"
}
```

---

## 3.2. Get renewable electricity integration

```http
GET /api/v1/integrations/renewable-electricity
```

Returns data from two sources:

| Source           | Description                                  |
| ---------------- | -------------------------------------------- |
| Local API        | CO₂ emission records stored in MongoDB Atlas |
| Ember Energy API | External yearly electricity generation data  |

### Query parameters

| Parameter    | Type   | Required | Description                                            |
| ------------ | ------ | -------: | ------------------------------------------------------ |
| `location`   | String |      Yes | Location selected from supported integration locations |
| `fromPeriod` | Number |      Yes | Start year                                             |
| `toPeriod`   | Number |      Yes | End year                                               |

### Example request

```http
GET /api/v1/integrations/renewable-electricity?location=Spain&fromPeriod=2020&toPeriod=2023
```

### Successful response

Status code:

```txt
200 OK
```

Example response:

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
      "generation_twh": 280.0
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

The exact structure of the `electricityGeneration` items depends on the Ember Energy API response.

### Unsupported location error

Status code:

```txt
400 Bad Request
```

Example response:

```json
{
  "message": "Unsupported location for Ember integration",
  "location": "Example",
  "supportedLocations": [
    "Spain",
    "France",
    "Germany"
  ]
}
```

### Missing local records error

Status code:

```txt
404 Not Found
```

Example response:

```json
{
  "message": "No local carbon emission records found for this Ember entity",
  "emberEntity": "Spain"
}
```

### External API error

Status code:

```txt
500 Internal Server Error
```

Example response:

```json
{
  "message": "Error retrieving renewable electricity integration",
  "error": "Ember API request failed with status 401"
}
```

---

# 4. Common error responses

## Route not found

Status code:

```txt
404 Not Found
```

Example response:

```json
{
  "message": "Route not found",
  "path": "/api/v1/no-existe"
}
```

## Validation error

Status code:

```txt
400 Bad Request
```

Example response:

```json
{
  "message": "Validation error",
  "errors": [
    "period must be between 1970 and the current year"
  ]
}
```

## Duplicate record

Status code:

```txt
409 Conflict
```

Example response:

```json
{
  "message": "A carbon emission record already exists for this location and period"
}
```

## Internal server error

Status code:

```txt
500 Internal Server Error
```

Example response:

```json
{
  "message": "Error retrieving renewable electricity integration",
  "error": "Unexpected error message"
}
```

---

# 5. Status codes summary

|                 Status code | Meaning                         | Used when                                                       |
| --------------------------: | ------------------------------- | --------------------------------------------------------------- |
|                    `200 OK` | Successful request              | GET, PUT and DELETE operations                                   |
|               `201 Created` | Resource created                | POST operation or initial data load                             |
|           `400 Bad Request` | Invalid request                 | Validation errors and unsupported integration location          |
|              `409 Conflict` | Conflict with existing resource | Duplicate `location` and `period` combination                   |
|             `404 Not Found` | Resource not found              | Invalid ID, route not found, no compatible local data           |
| `500 Internal Server Error` | Server error                    | Database or external API failure                                |

---

# 6. Notes about CORS and proxy integration

The backend enables CORS so that the Angular frontend can call the API.

The Ember Energy integration is implemented through a backend proxy:

```txt
Angular frontend → Project backend → Ember Energy API
```

This design has two advantages:

1. The Ember API key is not exposed in the frontend.
2. The integration is controlled by the project backend and can normalize the response before sending it to Angular.

---

# 7. Frontend routes related to the API

| Frontend route                        | API usage                                                        |
| ------------------------------------- | ---------------------------------------------------------------- |
| `/`                                   | Lists, filters, paginates and deletes CO₂ records                |
| `/records/new`                        | Creates a new CO₂ record                                         |
| `/records/:id/edit`                   | Edits an existing CO₂ record                                     |
| `/integrations/renewable-electricity` | Shows the Ember Energy integration and Highcharts visualizations |
| `/documentation` | Shows the project documentation page with links to README, diary, API documentation and test evidence |
