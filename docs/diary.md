# DGSIN-2526-10 Diary

## Team member

María Jesús Cadenas Sánchez

GitHub user:

```txt
mjcadenas
```

Repository:

```txt
https://github.com/mii-dgsin/dgsin-2526-10
```

Deployment:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com
```

---

# Project description

The project is a cloud information system for managing and visualizing CO₂ emission records by location and year.

The system provides:

- A REST API deployed on Google App Engine.
- Persistence using MongoDB Atlas.
- An Angular frontend.
- CRUD operations for the selected data source.
- Integration with an external REST API.
- Highcharts visualizations.
- Postman tests and public Postman documentation.
- Project documentation.

The main resource is:

```txt
carbon-emission-records
```

The external integration uses Ember Energy yearly electricity data.

---

# Data source

Main source:

```txt
https://datosmacro.expansion.com/energia-y-medio-ambiente/emisiones-co2
```

The dataset contains CO₂ emission records by location and year.

Example record:

```json
{
  "location": "Spain and Andorra",
  "period": 2022,
  "totalEmissionsMt": 235.471,
  "emissionsIntensity": 0.11,
  "emissionsPerCapita": 5.07,
  "annualVariation": -0.84
}
```

---

# Development progress

## Progress 1 - Project definition

The project objective was defined: creating a cloud information system to manage CO₂ emission records by location and year.

The selected resource was named:

```txt
carbon-emission-records
```

---

## Progress 2 - Repository structure

The GitHub repository was created and organized with separate folders:

```txt
backend/
frontend/
docs/
```

This separation makes it easier to develop the Express backend, Angular frontend and documentation independently.

---

## Progress 3 - Initial backend

A Node.js and Express backend was created.

Initial endpoints were added:

```txt
GET /
GET /api/v1/health
```

The health endpoint was used to verify that the backend was running correctly.

---

## Progress 4 - MongoDB Atlas connection

MongoDB Atlas was configured as the cloud database.

The backend connection logic was separated into:

```txt
backend/src/config/db.js
```

The MongoDB connection string is provided through environment variables.

---

## Progress 5 - Data model

The `CarbonEmissionRecord` model was created using Mongoose.

The model includes:

- `location`
- `period`
- `totalEmissionsMt`
- `emissionsIntensity`
- `emissionsPerCapita`
- `annualVariation`

A uniqueness rule was added to avoid duplicated records with the same `location` and `period`.

---

## Progress 6 - REST API implementation

The main REST resource was implemented:

```txt
/api/v1/carbon-emission-records
```

Implemented operations:

- POST collection.
- GET collection.
- DELETE collection.
- GET one resource.
- PUT one resource.
- DELETE one resource.
- GET locations.
- GET loadInitialData.
- GET docs redirect.

---

## Progress 7 - Initial data loading

An initial JSON dataset was created:

```txt
backend/data/carbonEmissionRecords.json
```

The route:

```txt
GET /api/v1/carbon-emission-records/loadInitialData
```

loads the data only if the MongoDB collection is empty.

---

## Progress 8 - Validation and error handling

Validation was added for the resource fields.

The API now handles:

- Missing required fields.
- Invalid year values.
- Duplicate records.
- Resource not found.
- Method not allowed.
- Wrong `_id` in PUT body.

Relevant HTTP status codes are returned, including:

```txt
400
404
405
409
```

---

## Progress 9 - Backend modularization

The backend was modularized into:

```txt
controllers/
routes/
models/
validators/
middlewares/
services/
config/
```

The main `app.js` file imports the separated route files.

---

## Progress 10 - App Engine deployment

The backend was deployed on Google App Engine.

The application is available at:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com
```

The backend connects to MongoDB Atlas from App Engine.

---

## Progress 11 - Angular frontend creation

An Angular frontend was created in the `frontend/` folder.

The frontend consumes the backend API deployed on App Engine.

---

## Progress 12 - Records page

The main records page was implemented.

It supports:

- Listing records.
- Location search.
- Exact year filter.
- Year range filter.
- Pagination.
- Items-per-page selector.
- Status messages.
- Delete one record.
- Delete all records.
- Load initial data.
- Navigation to create and edit views.

The filters were later reorganized to improve clarity and reduce visual noise.

---

## Progress 13 - Create record page

A separate Angular route was added for creating records:

```txt
/records/new
```

The form includes suggestions for existing locations using the local locations endpoint.

The user can select an existing location or type a new one.

---

## Progress 14 - Edit record page

A separate Angular route was added for editing records:

```txt
/records/:id/edit
```

The edit form loads the selected record and allows updating it.

The location field also includes suggestions using existing local locations.

---

## Progress 15 - Operation messages

The frontend was improved to show operation-specific messages.

Examples:

- Loading records...
- Deleting record...
- Deleting all records...
- Loading initial data...
- Refreshing records after deleting record...
- Refreshing records after loading initial data...

This improves user feedback during API operations.

---

## Progress 16 - External integration with Ember Energy

An external integration with Ember Energy was implemented.

The backend acts as a proxy to the external API:

```txt
/api/v1/integrations/renewable-electricity
```

The frontend does not expose the Ember API key.

---

## Progress 17 - Supported integration locations

The backend provides:

```txt
GET /api/v1/integrations/supported-locations
```

This endpoint returns compatible locations between the local CO₂ dataset and Ember Energy.

Controlled aliases are used for cases where the local dataset groups territories.

Example:

| Ember entity | Local dataset location |
|---|---|
| Spain | Spain and Andorra |
| France | France and Monaco |
| Italy | Italy, San Marino and the Holy See |

---

## Progress 18 - Integration view

The Angular route:

```txt
/integrations/renewable-electricity
```

was created.

It allows selecting a compatible location and a year range.

The view displays:

- Integration summary.
- Local CO₂ records.
- External Ember records.
- Highcharts visualizations.

---

## Progress 19 - Analytics view

The route:

```txt
/analytics
```

was added as a list of analytical widgets.

It links to the charts in the integration view using default parameters:

```txt
location=Spain
fromPeriod=2020
toPeriod=2023
```

The integration page reads the query parameters, loads the data automatically and scrolls to the selected chart.

---

## Progress 20 - Integrations index

The route:

```txt
/integrations
```

was added.

It acts as an index of available integrations and links to:

```txt
/integrations/renewable-electricity
```

---

## Progress 21 - About page

The route:

```txt
/about
```

was added.

It includes project information and the current status of the project video.

The current video message is:

```txt
The project video link is pending.
```

---

## Progress 22 - Documentation page

The route:

```txt
/documentation
```

was created to provide access to project documentation, GitHub, API documentation and Postman documentation.

---

## Progress 23 - Highcharts visualizations

Three Highcharts visualizations were added:

| Chart | Description |
|---|---|
| CO₂ emissions by year | Uses local records from the own API |
| Ember electricity data by year | Uses external Ember data through the proxy |
| CO₂ emissions vs electricity generation | Combines local and external data in one chart |

---

## Progress 24 - Postman tests

A Postman collection was created to test the deployed API.

The collection verifies:

- REST operations.
- Expected status codes.
- Duplicate conflict.
- Wrong PUT body id.
- Invalid JSON body.
- Not found errors.
- Method not allowed errors.
- Delete collection.
- Load initial data.
- Documentation redirect.
- Integration endpoints.

The collection is stored at:

```txt
docs/postman/DGSIN-2526-10.postman_collection.json
```

The final execution evidence is stored at:

```txt
docs/postman/postman-run-results.png
```

The public Postman documentation portal is:

```txt
https://documenter.getpostman.com/view/15287747/2sBXwyF6od
```

---

## Progress 25 - Frontend design improvements

Several UI improvements were added:

- Tab-style header navigation.
- Active route highlighting.
- More compact records filters.
- Year range grouped visually.
- Pagination and items-per-page grouped together.
- Custom favicon.
- Better operation messages.
- More readable documentation and about pages.

---

## Progress 26 - Angular build served by backend

The Angular production build was generated and copied into:

```txt
backend/public/
```

This allows the Express backend to serve the Angular frontend and the REST API from the same App Engine deployment.

---

# Technical decisions

## Node.js and Express

Express was selected to implement the REST API because it allows a clear separation between routes, controllers, validators and services.

## MongoDB Atlas

MongoDB Atlas was selected as the cloud persistence layer.

## Angular Router

Angular Router was used to provide separated views:

```txt
/
/records/new
/records/:id/edit
/integrations
/integrations/renewable-electricity
/analytics
/documentation
/about
```

## Backend proxy

The Ember Energy API is consumed through the backend. This avoids exposing the API key in the Angular frontend.

## Null values

Some original source fields may not be available. The project uses `null` instead of replacing missing values with `0`.

---

# Time tracking

Time was tracked using Toggl.

Final delivery includes:

```txt
summary.pdf
detailed.pdf
```

---

# Current pending item

The project video has not been published.

The application shows:

```txt
The project video link is pending.
```

