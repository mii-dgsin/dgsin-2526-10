# DGSIN-2526-10

Sistema de información en la nube para gestionar y analizar registros de emisiones de CO₂ por localización y año.

El proyecto se desarrolla para la asignatura **Desarrollo y Gestión de Sistemas de Información en la Nube**.

---

## Descripción

La aplicación permite consultar, crear, editar y eliminar datos de emisiones de CO₂ asociados a una localización y a un periodo temporal.

La fuente principal de datos es:

```txt
https://datosmacro.expansion.com/energia-y-medio-ambiente/emisiones-co2
```

La fuente seleccionada contiene información organizada en tablas HTML, por lo que los datos no se consumen directamente desde una API pública propia de la fuente.

Además, el backend integra la API externa de Ember Energy mediante un proxy propio. Esta integración permite complementar los registros locales de emisiones de CO₂ con datos externos de generación eléctrica anual.

La aplicación también incluye visualizaciones con Highcharts para mostrar la evolución de los datos propios, los datos externos y una gráfica combinada entre ambas fuentes.

---

## Repositorio

```txt
https://github.com/mii-dgsin/dgsin-2526-10
```

---

## URL desplegada

La API está desplegada en Google App Engine:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com
```

Endpoints principales desplegados:

```txt
GET https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/
GET https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/health
GET https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/carbon-emission-records
GET https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/carbon-emission-records/locations
GET https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/integrations/supported-locations
GET https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/integrations/renewable-electricity?location=Spain&fromPeriod=2020&toPeriod=2023
```

---

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- dotenv
- cors
- nodemon
- Google App Engine
- Google Cloud CLI
- Angular
- Angular Router
- TypeScript
- Font Awesome
- Zone.js
- Highcharts
- Ember Energy API
- Postman / Insomnia para pruebas de API

---

## Estructura del proyecto

```txt
dgsin-2526-10/
├── .gitignore
├── README.md
├── backend/
│   ├── .gcloudignore
│   ├── app.example.yaml
│   ├── data/
│   │   └── carbonEmissionRecords.json
│   ├── public/
│   ├── package-lock.json
│   ├── package.json
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
│       ├── scripts/
│       │   └── loadCarbonEmissionRecords.js
│       ├── services/
│       │   └── emberEnergy.service.js
│       └── validators/
│           └── carbonEmissionRecord.validator.js
├── docs/
│   ├── api.md
│   ├── diary.md
│   └── postman/
│       └── DGSIN-2526-10.postman_collection.json
│       └── postman-run-results.png
└── frontend/
    ├── angular.json
    ├── package-lock.json
    ├── package.json
    ├── public/
    ├── src/
    │   └── app/
    │       ├── models/
    │       ├── pages/
    │       │   ├── create-record-page/
    │       │   ├── documentation-page/
    │       │   ├── edit-record-page/
    │       │   ├── integration-page/
    │       │   └── records-page/
    │       └── services/
    ├── tsconfig.app.json
    ├── tsconfig.json
    └── tsconfig.spec.json
```

---

## Instalación del backend

```bash
git clone https://github.com/mii-dgsin/dgsin-2526-10.git
cd dgsin-2526-10/backend
npm install
```

---

## Variables de entorno del backend

Crear un archivo `.env` dentro de `backend/`:

```env
PORT=8080
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/dgsin-2526-10?retryWrites=true&w=majority
EMBER_API_KEY=YOUR_EMBER_API_KEY
```

El archivo `.env` no debe subirse al repositorio porque contiene credenciales privadas.

---

## Configuración de App Engine

El archivo real `app.yaml` no se sube al repositorio porque puede contener credenciales reales de MongoDB Atlas y la API key de Ember.

Se incluye una plantilla:

```txt
backend/app.example.yaml
```

Ejemplo:

```yaml
runtime: nodejs24

automatic_scaling:
  max_instances: 1

env_variables:
  NODE_ENV: "production"
  MONGODB_URI: "mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/dgsin-2526-10?retryWrites=true&w=majority"
  EMBER_API_KEY: "YOUR_EMBER_API_KEY"
```

Para desplegar desde la carpeta `backend/`:

```bash
gcloud app deploy
```

---

## Scripts del backend

Desde `backend/`:

```bash
npm run dev
```

Arranca el servidor en modo desarrollo.

```bash
npm start
```

Arranca el servidor en modo normal.

```bash
npm run load:carbon
```

`npm run load:carbon` carga los datos de emisiones de CO₂ desde `backend/data/carbonEmissionRecords.json` en MongoDB Atlas.

---

## Instalación del frontend

Desde la raíz del proyecto:

```bash
cd frontend
npm install
ng serve
```

La aplicación estará disponible en:

```txt
http://localhost:4200
```

---

## API propia: carbon-emission-records

### Endpoints principales

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/v1/health` | Comprueba que la API está funcionando |
| GET | `/api/v1/carbon-emission-records` | Lista y filtra registros de emisiones |
| GET | `/api/v1/carbon-emission-records/:id` | Obtiene un registro por ID |
| POST | `/api/v1/carbon-emission-records` | Crea un registro |
| PUT | `/api/v1/carbon-emission-records/:id` | Actualiza un registro |
| DELETE | `/api/v1/carbon-emission-records/:id` | Elimina un registro |
| GET | `/api/v1/carbon-emission-records/locations` | Devuelve localizaciones únicas del dataset local |
| GET | `/api/v1/carbon-emission-records/loadInitialData` | Inicializa datos si la colección está vacía |

### Parámetros de consulta soportados

| Parámetro | Descripción |
|---|---|
| `location` | Filtra por localización mediante búsqueda flexible |
| `period` | Filtra por un año concreto |
| `fromPeriod` | Filtra desde un año inicial |
| `toPeriod` | Filtra hasta un año final |
| `limit` | Define el número máximo de registros devueltos |
| `offset` | Define desde qué posición comienzan los resultados |

Ejemplo:

```http
GET /api/v1/carbon-emission-records?location=Spain&fromPeriod=2020&toPeriod=2023&limit=50&offset=0
```

El filtro de localización usa búsqueda flexible. Por ejemplo, una búsqueda por `Spain` puede devolver registros cuya localización original sea `Spain and Andorra`.

---

## Integraciones externas

### Ember Energy - Yearly electricity generation

El backend incluye una integración externa con la API de Ember Energy mediante un proxy propio.

| Endpoint | Descripción |
|---|---|
| `GET /api/v1/integrations/supported-locations` | Obtiene localizaciones compatibles entre Ember Energy y el dataset local |
| `GET /api/v1/integrations/renewable-electricity` | Devuelve datos integrados de emisiones locales y generación eléctrica externa |

Ejemplo:

```http
GET /api/v1/integrations/renewable-electricity?location=Spain&fromPeriod=2020&toPeriod=2023
```

La llamada a Ember se realiza desde el backend para no exponer la API key en Angular.

La ruta `/api/v1/integrations/supported-locations` obtiene dinámicamente las entidades disponibles en Ember Energy y las cruza con las localizaciones existentes en la colección local `carbon-emission-records`.

Para evitar falsos positivos, el cruce entre ambas fuentes se realiza mediante coincidencia exacta normalizada y alias controlados para casos en los que la fuente local agrupa varios territorios.

Ejemplo:

| Ember entity | Local CO₂ dataset location |
|---|---|
| Spain | Spain and Andorra |
| France | France and Monaco |
| Italy | Italy, San Marino and the Holy See |
| Switzerland | Switzerland and Liechtenstein |

---

## Modelo de datos

| Campo | Tipo | Descripción |
|---|---|---|
| `location` | String | Localización original tal y como aparece en la fuente |
| `period` | Number | Año del registro |
| `totalEmissionsMt` | Number | Emisiones totales de CO₂ en megatoneladas |
| `emissionsIntensity` | Number o null | Intensidad de emisiones |
| `emissionsPerCapita` | Number | Emisiones de CO₂ por habitante |
| `annualVariation` | Number o null | Variación anual de emisiones |

El modelo incluye una restricción para evitar duplicados con la misma combinación de `location` y `period`.

Los campos `emissionsIntensity` y `annualVariation` pueden ser `null` cuando la fuente no dispone de ese dato.

---

## Frontend

El frontend se ha creado con Angular y utiliza Angular Router.

La aplicación permite actualmente:

- Consultar registros de emisiones de CO₂ desde la API desplegada en Google App Engine.
- Mostrar los datos en una tabla.
- Filtrar por localización, año concreto y rango de años.
- Aplicar filtros automáticamente al escribir.
- Paginar resultados mediante `limit` y `offset`.
- Crear nuevos registros desde una vista separada.
- Editar registros existentes desde una vista separada.
- Eliminar registros desde la tabla.
- Mostrar mensajes de error devueltos por la API.
- Consultar la integración externa con Ember Energy desde una vista Angular.
- Seleccionar dinámicamente las localizaciones compatibles entre Ember Energy y el dataset local.
- Mostrar visualizaciones con Highcharts.
- Visualizar datos propios de emisiones de CO₂ por año.
- Visualizar datos externos de Ember Energy por año.
- Visualizar una gráfica combinada entre emisiones de CO₂ y datos externos de generación eléctrica.
- Consultar una página de documentación integrada en la propia aplicación.

Rutas principales:

| Ruta | Descripción |
|---|---|
| `/` | Listado, búsqueda, paginación y acciones |
| `/records/new` | Creación de un nuevo registro |
| `/records/:id/edit` | Edición de un registro existente |
| `/integrations/renewable-electricity` | Vista de integración externa con Ember Energy y visualizaciones |
| `/documentation` | Página de documentación del proyecto y enlaces relevantes |

---

## Documentación

El proyecto incluye documentación adicional en la carpeta `docs/`:

| Archivo | Descripción |
|---|---|
| `docs/diary.md` | Diario de desarrollo del proyecto |
| `docs/api.md` | Documentación formal de la API con ejemplos de endpoints, respuestas y códigos de estado |
| `docs/postman/DGSIN-2526-10.postman_collection.json` | Colección Postman con pruebas de API |

La aplicación Angular incluye además una página `/documentation` que resume el proyecto y enlaza a la documentación del repositorio.

---

## Pruebas

Se ha preparado una colección Postman compatible con producción App Engine:

```txt
docs/postman/DGSIN-2526-10.postman_collection.json
```

La colección prueba:

- Health check.
- Listado y filtros de registros.
- Localizaciones disponibles.
- Creación, duplicado, consulta, actualización y borrado de un registro de prueba.
- Localizaciones soportadas por la integración.
- Integración con Ember Energy.
- Error de localización no soportada.
- Error de ruta inexistente.

Las pruebas incluyen comprobaciones de códigos de estado y estructura básica de las respuestas.

Como evidencia de ejecución, se conserva una captura del Runner de Postman con el resultado de las pruebas ejecutadas contra producción:

```txt
docs/postman/postman-run-results.png
```

---

## Despliegue

La aplicación completa se ha desplegado en Google App Engine. El backend Express sirve tanto la API REST como la aplicación Angular generada para producción, y accede a los datos almacenados en MongoDB Atlas.

Durante el despliegue se resolvieron incidencias relacionadas con facturación, permisos sobre el bucket de staging y acceso de red desde App Engine hacia MongoDB Atlas.

---

## Estado actual

El backend está desplegado en Google App Engine y conectado a MongoDB Atlas.

La API `carbon-emission-records` dispone de operaciones CRUD, filtros, paginación, validaciones, gestión de errores, endpoint de localizaciones, inicialización de datos e integración externa con Ember Energy mediante proxy propio.

El frontend Angular consume la API desplegada y permite listar, filtrar, crear, editar y eliminar registros. También incluye una vista de integración externa con visualizaciones Highcharts y una página de documentación integrada.

---

## Próximos pasos

- Revisar visualmente la aplicación para preparar la grabación del vídeo.
- Enlazar el vídeo explicativo en la aplicación si se genera antes de la entrega.
- Realizar una revisión final de la documentación antes de entregar.

---

## Notas de seguridad

No deben subirse al repositorio:

```txt
backend/.env
backend/app.yaml
backend/node_modules/
frontend/node_modules/
frontend/.angular/
```

Sí se mantiene en el repositorio la plantilla:

```txt
backend/app.example.yaml
```
