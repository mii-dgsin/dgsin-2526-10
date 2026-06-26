# DGSIN-2526-10

Cloud information system for consulting, managing and visualizing CO₂ emission records by location and year.

The project has been developed for the subject **Desarrollo y Gestión de Sistemas de Información en la Nube**.

---

## Author

**María Jesús Cadenas Sánchez**

GitHub user:

```txt
mjcadenas
```

---

## Repository

```txt
https://github.com/mii-dgsin/dgsin-2526-10
```

---

## Deployed application

The complete application is deployed on Google App Engine:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com
```

The same App Engine deployment serves:

- The Angular frontend.
- The Express REST API.
- The static Angular build from `backend/public`.
- The backend proxy used for the external integration.

The REST API is available under:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1
```

---

## Project description

The application manages a dataset of CO₂ emission records. Each record represents the emissions of a location during a specific year.

The system allows the user to:

- List CO₂ emission records.
- Filter records by location.
- Filter records by exact year.
- Filter records by year range.
- Create new records.
- Edit existing records.
- Delete one record.
- Delete all records.
- Load initial data when the collection is empty.
- View operation status messages.
- View API errors in a user-friendly way.
- Access external data integrations.
- View Highcharts visualizations.
- Access project documentation and Postman documentation.

---

## Data source

Main dataset:

```txt
https://datosmacro.expansion.com/energia-y-medio-ambiente/emisiones-co2
```

The source contains CO₂ emission data organized by location and year.

The source is not used directly as a ready-made public API. The project stores the selected data in MongoDB Atlas and exposes it through its own REST API.

Resource name:

```txt
carbon-emission-records
```

The resource name follows the required naming restrictions:

- Only lowercase letters and hyphens.
- No spaces.
- No more than three words.

---

## External integration

The project includes an external integration with the **Ember Energy API**.

The integration combines:

| Source | Type | Purpose |
|---|---|---|
| `carbon-emission-records` | Own REST API | Local CO₂ emission records stored in MongoDB Atlas |
| Ember Energy API | External REST API | Yearly electricity generation data |

The frontend does not call Ember directly. The request is made through the backend:

```txt
Angular frontend -> Express backend proxy -> Ember Energy API
```

This avoids exposing the external API key in the frontend and satisfies the proxy integration requirement.

---

## Technologies

### Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- CORS
- dotenv
- Google App Engine
- Postman

### Frontend

- Angular
- Angular Router
- TypeScript
- FormsModule
- Font Awesome
- Highcharts
- Custom favicon
- Responsive CSS

---

## Project structure

```txt
dgsin-2526-10/
├── README.md
├── backend/
│   ├── app.example.yaml
│   ├── data/
│   │   └── carbonEmissionRecords.json
│   ├── package.json
│   ├── public/
│   │   └── Angular production build
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── carbonEmissionRecord.controller.js
│       │   └── integration.controller.js
│       ├── middlewares/
│       │   └── notFound.middleware.js
│       ├── models/
│       │   └── carbonEmissionRecord.model.js
│       ├── routes/
│       │   ├── carbonEmissionRecord.routes.js
│       │   └── integration.routes.js
│       ├── services/
│       │   └── emberEnergy.service.js
│       └── validators/
│           └── carbonEmissionRecord.validator.js
├── docs/
│   ├── api.md
│   ├── carbon-emission-records-docs.md
│   ├── diary.md
│   └── postman/
│       ├── DGSIN-2526-10.postman_collection.json
│       └── postman-run-results.png
└── frontend/
    ├── angular.json
    ├── package.json
    ├── src/
    │   ├── assets/
    │   │   └── favicon.webp
    │   ├── index.html
    │   └── app/
    │       ├── models/
    │       ├── pages/
    │       └── services/
    └── tsconfig.json
```

---

## Backend setup

From the `backend` folder:

```bash
npm install
npm run dev
```

The local backend runs on:

```txt
http://localhost:8080
```

Health check:

```txt
http://localhost:8080/api/v1/health
```

---

## Backend environment variables

Create a local `.env` file inside `backend/`:

```env
PORT=8080
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/dgsin-2526-10?retryWrites=true&w=majority
EMBER_API_KEY=YOUR_EMBER_API_KEY
```

The `.env` file must not be uploaded to GitHub.

---

## App Engine configuration

The real `app.yaml` file is not included in the repository because it may contain deployment-specific environment variables.

A safe template is provided:

```txt
backend/app.example.yaml
```

Example:

```yaml
runtime: nodejs24

automatic_scaling:
  max_instances: 1

env_variables:
  NODE_ENV: "production"
  MONGODB_URI: "mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/dgsin-2526-10?retryWrites=true&w=majority"
  EMBER_API_KEY: "YOUR_EMBER_API_KEY"
```

Deploy command from the `backend` folder:

```bash
gcloud app deploy
```

---

## Frontend setup

From the `frontend` folder:

```bash
npm install
ng serve
```

The local frontend runs on:

```txt
http://localhost:4200
```

---

## Frontend production build

From the `frontend` folder:

```bash
ng build
```

The Angular build is copied into:

```txt
backend/public/
```

This allows Express to serve the Angular application and the REST API from the same App Engine deployment.

---

## REST API

Base resource:

```txt
/api/v1/carbon-emission-records
```

### Main endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/health` | Checks API status |
| GET | `/api/v1/carbon-emission-records` | Lists and filters records |
| POST | `/api/v1/carbon-emission-records` | Creates a new record |
| DELETE | `/api/v1/carbon-emission-records` | Deletes all records |
| GET | `/api/v1/carbon-emission-records/:id` | Gets one record |
| PUT | `/api/v1/carbon-emission-records/:id` | Updates one record |
| DELETE | `/api/v1/carbon-emission-records/:id` | Deletes one record |
| GET | `/api/v1/carbon-emission-records/locations` | Returns available local locations |
| GET | `/api/v1/carbon-emission-records/loadInitialData` | Loads initial data only if the collection is empty |
| GET | `/api/v1/carbon-emission-records/docs` | Redirects to the public Postman documentation portal |

### Query parameters

| Parameter | Description |
|---|---|
| `location` | Filters by location using flexible search |
| `period` | Filters by exact year |
| `fromPeriod` | Filters from a starting year |
| `toPeriod` | Filters up to an ending year |
| `limit` | Number of records per page |
| `offset` | Number of records skipped |

Example:

```http
GET /api/v1/carbon-emission-records?location=Spain&fromPeriod=2020&toPeriod=2023&limit=50&offset=0
```

---

## API documentation

Project API documentation:

```txt
docs/api.md
```

Specific resource documentation:

```txt
docs/carbon-emission-records-docs.md
```

Public Postman documentation portal:

```txt
https://documenter.getpostman.com/view/15287747/2sBXwyF6od
```

The API also provides a redirect route:

```txt
GET /api/v1/carbon-emission-records/docs
```

---

## Postman tests

The Postman collection is located at:

```txt
docs/postman/DGSIN-2526-10.postman_collection.json
```

The collection tests:

- Health check.
- GET collection.
- GET collection with filters.
- POST collection.
- POST duplicate record returning `409 Conflict`.
- POST invalid body returning `400 Bad Request` or `422 Unprocessable Entity`.
- GET one record.
- PUT one record.
- PUT with body `_id` different from URL id returning `400 Bad Request`.
- DELETE one record.
- DELETE collection.
- GET deleted record returning `404 Not Found`.
- Method not allowed returning `405 Method Not Allowed`.
- Initial data loading.
- Postman documentation redirect.
- Integration endpoints.

The final execution evidence is stored in:

```txt
docs/postman/postman-run-results.png
```

No Insomnia evidence is included in the final delivery.

---

## Frontend routes

| Route | Description |
|---|---|
| `/` | Main records page |
| `/records/new` | Create record page |
| `/records/:id/edit` | Edit record page |
| `/integrations` | List of available integrations |
| `/integrations/renewable-electricity` | Ember Energy integration view |
| `/analytics` | List of analytical widgets and links to chart views |
| `/documentation` | Project documentation page |
| `/about` | Project information and video status |

---

## Frontend functionality

The Angular frontend includes:

- Tab-based header navigation.
- Active route highlighting.
- Records listing.
- Location suggestions using existing dataset locations.
- Exact year filter.
- Year range filter.
- Pagination with items-per-page selector.
- Clear, reload and search actions.
- Create record form.
- Edit record form.
- Delete one record.
- Delete all records.
- Load initial data button.
- Dynamic operation messages.
- User-friendly error and success messages.
- Highcharts visualizations.
- External integration through backend proxy.
- Documentation page.
- About page.

---

## Visualizations

The `/integrations/renewable-electricity` view includes three Highcharts visualizations:

| Chart | Data source | Description |
|---|---|---|
| CO₂ emissions by year | Local API | Shows total CO₂ emissions by year |
| Ember electricity data by year | External Ember Energy API | Shows yearly electricity data obtained through the proxy |
| CO₂ emissions vs electricity generation | Local API + external API | Combines both sources in one chart using two Y axes |

The `/analytics` page links directly to these visualizations using default query parameters:

```txt
location=Spain
fromPeriod=2020
toPeriod=2023
```

---

## About page and project video

The `/about` route includes project information and the status of the project video.

Current video status:

```txt
The project video link is pending.
```

The documentation does not state that the video has been delivered.

---

## Delivery files

The final activity requires the following files:

```txt
backend.zip
frontend.zip
summary.pdf
detailed.pdf
```

The Toggl reports are:

```txt
summary.pdf
detailed.pdf
```

The ZIP files should be generated after the final commit:

```bash
git archive --format=zip --output=backend.zip --prefix=backend/ HEAD:backend
git archive --format=zip --output=frontend.zip --prefix=frontend/ HEAD:frontend
```

---

## Security notes

The following files and folders must not be uploaded to GitHub:

```txt
backend/.env
backend/app.yaml
backend/node_modules/
frontend/node_modules/
frontend/.angular/
```

Only the safe deployment template should be uploaded:

```txt
backend/app.example.yaml
```
