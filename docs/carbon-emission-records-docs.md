# carbon-emission-records API documentation

Resource base path:

```txt
/api/v1/carbon-emission-records
```

Deployed URL:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/carbon-emission-records
```

This document describes the required REST operations for the `carbon-emission-records` resource.

---

## 1. Resource description

The `carbon-emission-records` resource stores CO₂ emission records by location and year.

Example record:

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

## 2. Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | String | Yes | MongoDB ObjectId |
| `location` | String | Yes | Dataset location |
| `period` | Number | Yes | Year |
| `totalEmissionsMt` | Number | Yes | Total CO₂ emissions in megatonnes |
| `emissionsIntensity` | Number or null | No | Emissions intensity |
| `emissionsPerCapita` | Number | Yes | CO₂ emissions per capita |
| `annualVariation` | Number or null | No | Annual variation |

The pair `location` + `period` must be unique.

---

## 3. POST collection

Creates a new resource.

```http
POST /api/v1/carbon-emission-records
```

Request body:

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

Response:

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

If the resource already exists:

```http
409 Conflict
```

```json
{
  "message": "A carbon emission record already exists for this location and period"
}
```

If the JSON body does not contain the expected fields:

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

---

## 4. GET collection

Returns the collection.

```http
GET /api/v1/carbon-emission-records
```

Optional query parameters:

| Parameter | Description |
|---|---|
| `location` | Flexible location search |
| `period` | Exact year |
| `fromPeriod` | Start year |
| `toPeriod` | End year |
| `limit` | Page size |
| `offset` | Pagination offset |

Example:

```http
GET /api/v1/carbon-emission-records?location=Spain&fromPeriod=2020&toPeriod=2023&limit=50&offset=0
```

Response:

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

## 5. DELETE collection

Deletes all resources.

```http
DELETE /api/v1/carbon-emission-records
```

Response:

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

## 6. GET one resource

Gets one resource by id.

```http
GET /api/v1/carbon-emission-records/:id
```

Example:

```http
GET /api/v1/carbon-emission-records/68585f4f5c93c6ab1f2c1234
```

Response:

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

If the resource does not exist:

```http
404 Not Found
```

```json
{
  "message": "Carbon emission record not found"
}
```

---

## 7. PUT one resource

Updates one resource.

```http
PUT /api/v1/carbon-emission-records/:id
```

Request body:

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

Response:

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

---

## 8. Incorrect PUT with id conflict

If the body `_id` does not match the id in the URL:

```http
PUT /api/v1/carbon-emission-records/68585f4f5c93c6ab1f2c1234
```

Request body:

```json
{
  "_id": "000000000000000000000000",
  "location": "Spain and Andorra",
  "period": 2026,
  "totalEmissionsMt": 3,
  "emissionsIntensity": null,
  "emissionsPerCapita": 22,
  "annualVariation": null
}
```

Response:

```http
400 Bad Request
```

```json
{
  "message": "The request body id must match the URL resource id"
}
```

If the update creates a duplicate `location` and `period`:

```http
409 Conflict
```

```json
{
  "message": "A carbon emission record already exists for this location and period"
}
```

---

## 9. DELETE one resource

Deletes one resource by id.

```http
DELETE /api/v1/carbon-emission-records/:id
```

Response:

```http
200 OK
```

```json
{
  "message": "Carbon emission record deleted successfully"
}
```

If the resource does not exist:

```http
404 Not Found
```

```json
{
  "message": "Carbon emission record not found"
}
```

---

## 10. loadInitialData

Loads the initial data only if the collection is empty.

```http
GET /api/v1/carbon-emission-records/loadInitialData
```

If records are loaded:

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

If the collection already contains records:

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

## 11. Documentation redirect

Redirects to the public Postman documentation portal.

```http
GET /api/v1/carbon-emission-records/docs
```

Response:

```http
302 Found
```

Redirect URL:

```txt
https://documenter.getpostman.com/view/15287747/2sBXwyF6od
```

---

## 12. Method not allowed

Known routes return `405 Method Not Allowed` when an unsupported method is used.

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

## 13. Status codes

| Status code | Meaning |
|---:|---|
| `200 OK` | Successful GET, PUT or DELETE |
| `201 Created` | Resource created or initial data loaded |
| `302 Found` | Documentation redirect |
| `400 Bad Request` | Validation error or wrong body id |
| `404 Not Found` | Resource not found |
| `405 Method Not Allowed` | Unsupported method |
| `409 Conflict` | Duplicate resource |
| `500 Internal Server Error` | Server error |
