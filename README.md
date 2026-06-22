# DGSIN-2526-10

Sistema de información en la nube para gestionar y analizar registros de emisiones de CO₂ por localización y año.

El proyecto se desarrolla para la asignatura **Desarrollo y Gestión de Sistemas de Información en la Nube**.

---

## Descripción

La aplicación permite consultar, crear, editar y eliminar datos de emisiones de CO₂ asociados a una localización y a un periodo temporal.

La fuente principal de datos es:

https://datosmacro.expansion.com/energia-y-medio-ambiente/emisiones-co2

La fuente seleccionada contiene información organizada en tablas HTML, por lo que los datos no se consumen directamente desde una API pública propia de la fuente.

En fases posteriores, el sistema se integrará con una API externa de datos energéticos para poder realizar comparaciones relacionadas con la transición energética.

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
- TypeScript
- Font Awesome
- Zone.js
- Insomnia para pruebas de API

---

## Estructura del proyecto

```txt
DGSIN-2526-10/
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
│       │   └── carbonEmissionRecord.controller.js
│       ├── middlewares/
│       │   └── notFound.middleware.js
│       ├── models/
│       │   └── carbonEmissionRecord.model.js
│       ├── routes/
│       │   └── carbonEmissionRecord.routes.js
│       ├── scripts/
│       │   └── loadCarbonEmissionRecords.js
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
    ├── tsconfig.app.json
    ├── tsconfig.json
    └── tsconfig.spec.json
```

---

## Instalación del backend

Clonar el repositorio:

```bash
git clone https://github.com/mii-dgsin/DGSIN-2526-10.git
cd DGSIN-2526-10/backend
```

Instalar dependencias:

```bash
npm install
```

---

## Variables de entorno del backend

Crear un archivo `.env` dentro de la carpeta `backend/` con el siguiente contenido:

```env
PORT=8080
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/dgsin-2526-10?retryWrites=true&w=majority
```

El archivo `.env` no debe subirse al repositorio porque contiene credenciales privadas.

---

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

Para desplegar desde la carpeta `backend/`:

```bash
gcloud app deploy
```

---

## Scripts del backend

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

Carga los datos de emisiones de CO₂ desde `backend/data/carbonEmissionRecords.json` en MongoDB Atlas.

---

## Instalación del frontend

Desde la raíz del proyecto:

```bash
cd frontend
npm install
```

Arrancar Angular en local:

```bash
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

El endpoint principal permite los siguientes parámetros:

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

Si se busca `Spain`, la API puede devolver registros cuya localización original sea `Spain and Andorra`, ya que el filtro de localización usa una búsqueda flexible.

---

## Modelo de datos

El recurso principal de la API es `carbon-emission-records`.

| Campo | Tipo | Descripción |
|---|---|---|
| `location` | String | Localización original tal y como aparece en la fuente |
| `period` | Number | Año del registro |
| `totalEmissionsMt` | Number | Emisiones totales de CO₂ en megatoneladas |
| `emissionsIntensity` | Number o null | Intensidad de emisiones |
| `emissionsPerCapita` | Number | Emisiones de CO₂ por habitante |
| `annualVariation` | Number o null | Variación anual de emisiones |

El modelo incluye una restricción para evitar duplicados con la misma combinación de `location` y `period`.

Ejemplo de registro:

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

---

## Frontend

El frontend se ha creado con Angular.

La aplicación permite actualmente:

- Consultar registros de emisiones de CO₂ desde la API desplegada en Google App Engine.
- Mostrar los datos en una tabla.
- Filtrar por localización.
- Filtrar por año concreto.
- Filtrar por rango de años.
- Aplicar filtros automáticamente al escribir.
- Paginar resultados mediante `limit` y `offset`.
- Seleccionar el tamaño de página: 25, 50 o 100 registros.
- Validar que los años introducidos estén entre 1970 y 2023.
- Evitar rangos de años incorrectos, por ejemplo cuando `fromPeriod` es mayor que `toPeriod`.
- Crear nuevos registros desde un formulario Angular.
- Mostrar iconos de acción mediante Font Awesome.

Durante la configuración inicial del frontend se detectó el error:

```txt
NG0908: In this configuration Angular requires Zone.js
```

El problema se resolvió instalando `zone.js` y cargándolo en `main.ts`.

También se corrigió un aviso de TypeScript 6 en `tsconfig.app.json`, añadiendo explícitamente la propiedad `rootDir` con el valor `./src`.

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
- `POST /api/v1/carbon-emission-records`
- `DELETE /api/v1/carbon-emission-records/:id`

Queda pendiente completar y documentar las pruebas de `PUT`.

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

La API dispone del recurso `carbon-emission-records` con operaciones CRUD básicas, validación de datos, control de rutas no encontradas y filtros por localización y periodo.

El frontend Angular ya consume datos reales desde la API desplegada, muestra los registros en una tabla, permite filtrar, paginar y crear nuevos registros desde la interfaz web.

---

## Próximos pasos

- Completar pruebas CRUD con Insomnia.
- Revisar y completar la documentación final de la API.
- Mejorar el diseño visual del frontend Angular.
- Añadir edición de registros desde Angular.
- Revisar eliminación de registros desde Angular.
- Integrar una API externa de datos energéticos.
- Añadir visualizaciones de datos.

---

## Notas de seguridad

No deben subirse al repositorio los siguientes archivos o carpetas:

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
