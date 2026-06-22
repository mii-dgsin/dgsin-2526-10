# DGSIN-2526-10

Sistema de información en la nube para gestionar y analizar registros de emisiones de CO₂ por localización y año.

El proyecto se desarrolla para la asignatura **Desarrollo y Gestión de Sistemas de Información en la Nube**.

## Descripción

La aplicación permite consultar, crear, editar y eliminar datos de emisiones de CO₂ asociados a una localización y un periodo temporal.

La fuente principal de datos es:

https://datosmacro.expansion.com/energia-y-medio-ambiente/emisiones-co2

La fuente seleccionada contiene información organizada en tablas HTML, por lo que los datos no se consumen directamente desde una API pública propia de la fuente.

En fases posteriores, el sistema se integrará con una API externa de datos energéticos para poder realizar comparaciones relacionadas con la transición energética.

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
- Angular
- TypeScript
- Insomnia para pruebas de API

## Estructura del proyecto

```txt
DGSIN-2526-10/
├── .gitignore
├── README.md
├── backend/
├── docs/
└── frontend/
```

## Instalación del backend

```bash
git clone https://github.com/mii-dgsin/DGSIN-2526-10.git
cd DGSIN-2526-10/backend
npm install
```

## Variables de entorno del backend

Crear un archivo `.env` dentro de `backend/`:

```env
PORT=8080
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/dgsin-2526-10?retryWrites=true&w=majority
```

El archivo `.env` no debe subirse al repositorio porque contiene credenciales privadas.

## Configuración de App Engine

El archivo real `app.yaml` no se sube al repositorio porque puede contener credenciales reales de MongoDB Atlas.

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
```

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

Carga los datos iniciales desde `backend/data/carbonEmissionRecords.json` en MongoDB Atlas.

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

El filtro de localización usa búsqueda flexible. Por ejemplo, si se busca:

```txt
Spain
```

la API puede devolver registros cuya localización original sea:

```txt
Spain and Andorra
```

Esto permite conservar el valor original de la fuente en el campo `location` y, al mismo tiempo, facilitar búsquedas desde la API y el frontend.

También puede buscarse por el valor completo:

```http
GET /api/v1/carbon-emission-records?location=Spain%20and%20Andorra
```

### Filtrar por año

```http
GET /api/v1/carbon-emission-records?period=2022
```

Obtiene los registros correspondientes a un año concreto.

### Filtrar por rango de años

```http
GET /api/v1/carbon-emission-records?fromPeriod=2020&toPeriod=2023
```

Obtiene los registros incluidos dentro de un rango de años.

### Filtrar por localización y año

```http
GET /api/v1/carbon-emission-records?location=Spain&period=2022
```

Obtiene los registros correspondientes a una localización y un año concretos.

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

| Campo | Tipo | Descripción |
|---|---|---|
| `location` | String | Localización original tal y como aparece en la fuente |
| `period` | Number | Año del registro |
| `totalEmissionsMt` | Number | Emisiones totales de CO₂ en megatoneladas |
| `emissionsIntensity` | Number o null | Intensidad de emisiones |
| `emissionsPerCapita` | Number | Emisiones de CO₂ por habitante |
| `annualVariation` | Number o null | Variación anual de emisiones |

El modelo incluye una restricción para evitar duplicados con la misma combinación de `location` y `period`.

## Pruebas

Las pruebas iniciales de la API se están realizando con Insomnia.

Endpoints probados:

- `GET /api/v1/health`
- `GET /api/v1/carbon-emission-records`
- `GET /api/v1/carbon-emission-records?location=Spain`
- `GET /api/v1/carbon-emission-records?period=2022`
- `GET /api/v1/carbon-emission-records?fromPeriod=2020&toPeriod=2023`
- `POST /api/v1/carbon-emission-records`

Queda pendiente completar y documentar las pruebas de `PUT` y `DELETE`.

## Despliegue

El backend se ha desplegado en Google App Engine.

Durante el despliegue se resolvieron incidencias relacionadas con:

- Facturación del proyecto de Google Cloud.
- Permisos sobre el bucket de staging de App Engine.
- Acceso de red desde App Engine hacia MongoDB Atlas.

## Frontend

El frontend se ha creado con Angular.

La primera versión del frontend permite:

- Consultar registros desde la API desplegada.
- Mostrar datos en una tabla.
- Filtrar por localización.
- Filtrar por año concreto.
- Filtrar por rango de años.

Durante la configuración inicial se detectó el error:

```txt
NG0908: In this configuration Angular requires Zone.js
```

El problema se resolvió instalando `zone.js` y cargándolo en `main.ts`.

## Estado actual

Actualmente el backend arranca correctamente en local y está desplegado en Google App Engine.

La API dispone del recurso `carbon-emission-records` con operaciones CRUD básicas, validación de datos, control de rutas no encontradas y filtros por localización y periodo.

El frontend Angular ya consume datos reales desde la API desplegada y muestra los registros en una tabla.

## Próximos pasos

- Completar pruebas CRUD con Insomnia.
- Revisar y completar la documentación final de la API.
- Mejorar el diseño visual del frontend Angular.
- Añadir operaciones de creación, edición y eliminación desde Angular.
- Integrar una API externa de datos energéticos.
- Añadir visualizaciones de datos.
