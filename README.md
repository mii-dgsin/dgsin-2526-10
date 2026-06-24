# DGSIN-2526-10

Sistema de información en la nube para gestionar y analizar registros de emisiones de CO₂ por localización y año.

El proyecto se desarrolla para la asignatura **Desarrollo y Gestión de Sistemas de Información en la Nube**.

---

## Descripción

La aplicación permite consultar, crear, editar y eliminar datos de emisiones de CO₂ asociados a una localización y a un periodo temporal.

La fuente principal de datos es:

https://datosmacro.expansion.com/energia-y-medio-ambiente/emisiones-co2

La fuente seleccionada contiene información organizada en tablas HTML, por lo que los datos no se consumen directamente desde una API pública propia de la fuente.

Además, el backend integra una API externa de Ember Energy mediante un proxy propio para complementar la información de emisiones con datos de generación eléctrica anual.

---

## Repositorio

[mii-dgsin/dgsin-2526-10](https://github.com/mii-dgsin/dgsin-2526-10)

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
GET https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/carbon-emission-records?location=Spain
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
- Ember Energy API
- Insomnia para pruebas de API

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
│   ├── diary.md
│   └── postman/
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
    │       │   ├── edit-record-page/
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

Carga los datos de emisiones de CO₂ desde `backend/data/carbonEmissionRecords.json` en MongoDB Atlas.

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

## Endpoints principales

### Health check

```http
GET /api/v1/health
```

Comprueba que la API está funcionando.

### Obtener registros de emisiones

```http
GET /api/v1/carbon-emission-records
```

Obtiene registros de emisiones de CO₂.

### Filtrar por localización

```http
GET /api/v1/carbon-emission-records?location=Spain
```

El filtro de localización usa búsqueda flexible. Por ejemplo, si se busca `Spain`, la API puede devolver registros cuya localización original sea `Spain and Andorra`.

### Filtrar por año

```http
GET /api/v1/carbon-emission-records?period=2022
```

Obtiene registros de un año concreto.

### Filtrar por rango de años

```http
GET /api/v1/carbon-emission-records?fromPeriod=2020&toPeriod=2023
```

Obtiene registros incluidos dentro de un rango de años.

### Filtrar con paginación

```http
GET /api/v1/carbon-emission-records?location=Spain&fromPeriod=2020&toPeriod=2023&limit=50&offset=0
```

Permite filtrar registros y limitar la cantidad de resultados devueltos.

### Obtener un registro por ID

```http
GET /api/v1/carbon-emission-records/:id
```

Obtiene un registro concreto mediante su identificador.

### Crear un registro

```http
POST /api/v1/carbon-emission-records
```

Ejemplo de body:

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

Si ya existe un registro con la misma combinación de `location` y `period`, la API devuelve un error indicando que el registro ya existe.

### Actualizar un registro

```http
PUT /api/v1/carbon-emission-records/:id
```

Actualiza un registro existente.

### Eliminar un registro

```http
DELETE /api/v1/carbon-emission-records/:id
```

Elimina un registro existente.

---

## Parámetros de consulta soportados

| Parámetro | Descripción |
|---|---|
| `location` | Filtra por localización mediante búsqueda flexible |
| `period` | Filtra por un año concreto |
| `fromPeriod` | Filtra desde un año inicial |
| `toPeriod` | Filtra hasta un año final |
| `limit` | Define el número máximo de registros devueltos |
| `offset` | Define desde qué posición comienzan los resultados |

---

## Integraciones externas

### Ember Energy - Yearly electricity generation

El backend incluye una integración externa con la API de Ember Energy mediante un proxy propio.

La ruta expuesta por la API del proyecto es:

```http
GET /api/v1/integrations/renewable-electricity
```

Ejemplo:

```http
GET /api/v1/integrations/renewable-electricity?location=Spain&fromPeriod=2020&toPeriod=2023
```

Esta ruta combina:

| Fuente | Descripción |
|---|---|
| `carbon-emission-records` | Datos propios de emisiones de CO₂ almacenados en MongoDB Atlas |
| Ember Energy API | Datos externos de generación eléctrica anual |

La llamada a Ember se realiza desde el backend para no exponer la API key en Angular.

La integración requiere definir la variable de entorno:

```env
EMBER_API_KEY=YOUR_EMBER_API_KEY
```

La respuesta incluye una sección `source` con la atribución correspondiente a Ember Energy.

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

Ejemplo:

```json
{
  "location": "Afghanistan",
  "period": 1970,
  "totalEmissionsMt": 1.734,
  "emissionsIntensity": null,
  "emissionsPerCapita": 0.16,
  "annualVariation": null
}
```

Los campos `emissionsIntensity` y `annualVariation` pueden ser `null` cuando la fuente no dispone de ese dato.

---

## Frontend

El frontend se ha creado con Angular y utiliza Angular Router.

La aplicación permite actualmente:

- Consultar registros de emisiones de CO₂ desde la API desplegada en Google App Engine.
- Mostrar los datos en una tabla.
- Filtrar por localización.
- Filtrar por año concreto.
- Filtrar por rango de años.
- Aplicar filtros automáticamente al escribir.
- Paginar resultados mediante `limit` y `offset`.
- Seleccionar el tamaño de página: 25, 50 o 100 registros.
- Validar que los años introducidos estén entre 1970 y el año actual.
- Evitar rangos de años incorrectos.
- Crear nuevos registros desde una vista separada.
- Editar registros existentes desde una vista separada.
- Eliminar registros desde la tabla.
- Mostrar iconos de acción mediante Font Awesome.
- Mostrar mensajes de error devueltos por la API.
- Consultar la integración externa con Ember Energy desde una vista Angular.
- Mostrar un resumen de datos combinados entre registros locales de CO₂ y datos externos de generación eléctrica.

Rutas principales:

| Ruta | Descripción |
|---|---|
| `/` | Listado, búsqueda, paginación y acciones |
| `/records/new` | Creación de un nuevo registro |
| `/records/:id/edit` | Edición de un registro existente |
| `/integrations/renewable-electricity` | Vista de integración externa con Ember Energy |

Durante la configuración inicial del frontend se detectó el error `NG0908: In this configuration Angular requires Zone.js`. El problema se resolvió instalando `zone.js` y cargándolo en `main.ts`.

También se corrigió un aviso de TypeScript 6 en `tsconfig.app.json`, añadiendo explícitamente la propiedad `rootDir` con el valor `./src`.

En algunas vistas se utilizó `ChangeDetectorRef` para asegurar que la interfaz se actualiza correctamente tras recibir respuestas HTTP.

---

## Pruebas

Las pruebas iniciales de la API se están realizando con Insomnia.

Endpoints probados:

- `GET /api/v1/health`
- `GET /api/v1/carbon-emission-records`
- `GET /api/v1/carbon-emission-records?location=Spain`
- `GET /api/v1/carbon-emission-records?period=2022`
- `GET /api/v1/carbon-emission-records?fromPeriod=2020&toPeriod=2023`
- `GET /api/v1/carbon-emission-records?limit=50&offset=0`
- `GET /api/v1/carbon-emission-records/:id`
- `POST /api/v1/carbon-emission-records`
- `PUT /api/v1/carbon-emission-records/:id`
- `DELETE /api/v1/carbon-emission-records/:id`
- `GET /api/v1/integrations/renewable-electricity`

Queda pendiente completar la documentación formal de las pruebas y exportar la colección para la entrega final si fuera necesario.

---

## Despliegue

El backend se ha desplegado en Google App Engine.

Durante el despliegue se resolvieron incidencias relacionadas con:

- Facturación del proyecto de Google Cloud.
- Permisos sobre el bucket de staging de App Engine.
- Acceso de red desde App Engine hacia MongoDB Atlas.

La aplicación desplegada responde correctamente desde la URL pública y accede a los datos almacenados en MongoDB Atlas.

---

## Estado actual

Actualmente el backend arranca correctamente en local y está desplegado en Google App Engine.

La API dispone del recurso `carbon-emission-records` con operaciones CRUD, validación de datos, control de rutas no encontradas, filtros por localización y periodo, paginación, gestión de duplicados e integración externa con Ember Energy mediante proxy propio.

El frontend Angular consume datos reales desde la API desplegada, muestra los registros en una tabla y permite filtrar, paginar, crear, editar y eliminar registros desde la interfaz web.

---

## Próximos pasos

- Crear una vista frontend para mostrar los datos integrados con Ember Energy.
- Añadir visualizaciones con Highcharts o Google Charts.
- Completar la documentación formal de la API.
- Preparar colección de pruebas de Postman o Insomnia con comprobaciones.
- Enlazar la documentación desde la aplicación.
- Enlazar las visualizaciones desde la aplicación.
- Actualizar el diario y el README con los nuevos avances.

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
