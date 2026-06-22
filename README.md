# DGSIN-2526-10

Sistema de información en la nube para gestionar y analizar registros de emisiones de CO₂ por país y año.

El proyecto se desarrolla para la asignatura **Desarrollo y Gestión de Sistemas de Información en la Nube**.

## Descripción

La aplicación permite consultar, crear, editar y eliminar datos de emisiones de CO₂ asociados a una localización y un periodo temporal.

La fuente principal de datos es:

https://datosmacro.expansion.com/energia-y-medio-ambiente/emisiones-co2

La fuente seleccionada contiene información organizada en tablas HTML, por lo que los datos no se consumen directamente desde una API pública propia de la fuente.

En fases posteriores, el sistema se integrará con una API externa de datos energéticos para poder realizar comparaciones relacionadas con la transición energética.

## URL desplegada

La API está desplegada en Google App Engine:

https://dgsin-2526-10-mjcadenas.ew.r.appspot.com

Endpoints principales desplegados:

```txt
GET https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/
GET https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/health
GET https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/carbon-emission-records
GET https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/carbon-emission-records?location=Spain
```

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
- Insomnia para pruebas de API

## Estructura del proyecto

```txt
DGSIN-2526-10/
├── backend/
│   ├── data/
│   │   └── carbonEmissionRecords.json
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── carbonEmissionRecord.controller.js
│   │   ├── middlewares/
│   │   │   └── notFound.middleware.js
│   │   ├── models/
│   │   │   └── carbonEmissionRecord.model.js
│   │   ├── routes/
│   │   │   └── carbonEmissionRecord.routes.js
│   │   ├── scripts/
│   │   │   └── loadCarbonEmissionRecords.js
│   │   ├── validators/
│   │   │   └── carbonEmissionRecord.validator.js
│   │   └── app.js
│   ├── .env
│   ├── .gitignore
│   ├── app.example.yaml
│   ├── package-lock.json
│   └── package.json
├── docs/
│   ├── diary.md
│   └── postman/
└── README.md
```

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/mii-dgsin/DGSIN-2526-10.git
cd DGSIN-2526-10/backend
```

Instalar dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` dentro de la carpeta `backend/` con el siguiente contenido:

```env
PORT=8080
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/dgsin-2526-10?retryWrites=true&w=majority
```

El archivo `.env` no debe subirse al repositorio porque contiene credenciales privadas.

## Configuración de App Engine

El archivo real `app.yaml` no se sube al repositorio porque puede contener credenciales reales de MongoDB Atlas.

Se incluye una plantilla de ejemplo:

```txt
backend/app.example.yaml
```

Ejemplo de configuración:

```yaml
runtime: nodejs24

automatic_scaling:
  max_instances: 1

env_variables:
  NODE_ENV: "production"
  MONGODB_URI: "mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/dgsin-2526-10?retryWrites=true&w=majority"
```

## Scripts disponibles

Dentro de la carpeta `backend/` se pueden ejecutar los siguientes comandos:

```bash
npm run dev
```

Arranca el servidor en modo desarrollo usando nodemon.

```bash
npm start
```

Arranca el servidor en modo normal.

```bash
npm run load:carbon
```

Carga los datos iniciales de emisiones de CO₂ desde `backend/data/carbonEmissionRecords.json` en MongoDB Atlas.

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

Obtiene todos los registros de emisiones de CO₂.

### Filtrar por país

```http
GET /api/v1/carbon-emission-records?location=Spain
```

Obtiene los registros correspondientes a una localización normalizada concreta.

### Filtrar por año

```http
GET /api/v1/carbon-emission-records?period=2022
```

Obtiene los registros correspondientes a un año concreto.

### Filtrar por país y año

```http
GET /api/v1/carbon-emission-records?location=Spain&period=2022
```

Obtiene los registros correspondientes a una localización normalizada y un año concretos.

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
  "normalizedLocation": "Spain",
  "period": 2022,
  "totalEmissionsMt": 235.471,
  "emissionsIntensity": 0.11,
  "emissionsPerCapita": 5.07,
  "annualVariation": -0.84
}
```

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

## Modelo de datos

El recurso principal de la API es `carbon-emission-records`.

| Campo | Tipo | Descripción |
|---|---|---|
| `location` | String | Localización original tal y como aparece en la fuente |
| `normalizedLocation` | String | Nombre normalizado del país para búsquedas e integración futura |
| `period` | Number | Año del registro |
| `totalEmissionsMt` | Number | Emisiones totales de CO₂ en megatoneladas |
| `emissionsIntensity` | Number | Intensidad de emisiones |
| `emissionsPerCapita` | Number | Emisiones de CO₂ por habitante |
| `annualVariation` | Number | Variación anual de emisiones |

El modelo incluye una restricción para evitar duplicados con la misma combinación de `normalizedLocation` y `period`.

## Pruebas

Las pruebas iniciales de la API se están realizando con Insomnia.

Endpoints probados inicialmente:

- `GET /api/v1/health`
- `GET /api/v1/carbon-emission-records`
- `GET /api/v1/carbon-emission-records?location=Spain`
- `GET /api/v1/carbon-emission-records?period=2022`
- `POST /api/v1/carbon-emission-records`

Queda pendiente completar y documentar las pruebas de `PUT` y `DELETE`.

## Despliegue

El backend se ha desplegado en Google App Engine.

Durante el despliegue se resolvieron incidencias relacionadas con:

- Facturación del proyecto de Google Cloud.
- Permisos sobre el bucket de staging de App Engine.
- Acceso de red desde App Engine hacia MongoDB Atlas.

La aplicación desplegada responde correctamente desde la URL pública y accede a los datos almacenados en MongoDB Atlas.

## Estado actual

Actualmente el backend arranca correctamente en local y también está desplegado en Google App Engine.

La API dispone del recurso `carbon-emission-records` con operaciones CRUD básicas, validación de datos, control de rutas no encontradas y filtros por localización normalizada y periodo.

## Próximos pasos

- Completar pruebas CRUD con Insomnia.
- Añadir más registros reales de emisiones de CO₂.
- Preparar documentación final de la API.
- Crear frontend con Angular.
- Integrar una API externa de datos energéticos.
- Añadir visualizaciones de datos.
