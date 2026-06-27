# DGSIN-2526-10

Sistema de información en la nube para gestionar, consultar y visualizar registros de emisiones de CO₂ por localización y año.

Proyecto desarrollado para la asignatura **Desarrollo y Gestión de Sistemas de Información en la Nube**.

---

## Autora

**María Jesús Cadenas Sánchez**

Usuario de GitHub:

```txt
mjcadenas
```

Repositorio:

```txt
https://github.com/mii-dgsin/dgsin-2526-10
```

Aplicación desplegada:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com
```

URL base de la API:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1
```

---

## Objetivo del proyecto

El objetivo del proyecto es proporcionar una aplicación cloud que permita gestionar registros de emisiones de CO₂ y compararlos con una fuente externa de datos de generación eléctrica anual.

El recurso principal es:

```txt
carbon-emission-records
```

El nombre del recurso cumple las restricciones indicadas:

- Solo letras minúsculas.
- Uso de guiones.
- Sin espacios.
- No más de tres palabras.

---

## Fuente de datos principal

Fuente:

```txt
https://datosmacro.expansion.com/energia-y-medio-ambiente/emisiones-co2
```

La fuente contiene información de emisiones de CO₂ por localización y año.

El proyecto almacena los datos seleccionados en MongoDB Atlas y los expone mediante una API REST propia.

Ejemplo de registro:

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

## Integración externa

El proyecto integra los registros locales de emisiones de CO₂ con datos externos de generación eléctrica anual de **Ember Energy**.

La integración combina:

| Fuente | Tipo | Uso |
|---|---|---|
| `carbon-emission-records` | API REST propia | Registros locales de emisiones de CO₂ almacenados en MongoDB Atlas |
| Ember Energy API | API REST externa | Datos anuales de generación eléctrica |

La API externa se consume mediante un proxy propio en el backend:

```txt
Frontend Angular -> Backend Express -> API externa Ember Energy
```

Este diseño evita exponer la clave de la API externa en el navegador.

---

## Tecnologías utilizadas

### Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- CORS
- dotenv
- Google App Engine
- Postman
- Newman
- OpenAPI 3.0.3
- Swagger UI

### Frontend

- Angular
- Angular Router
- TypeScript
- FormsModule
- Font Awesome
- Highcharts
- CSS responsive
- Favicon personalizado

---

## Estructura del proyecto

```txt
dgsin-2526-10/
├── README.md
├── backend/
│   ├── app.example.yaml
│   ├── data/
│   │   └── carbonEmissionRecords.json
│   ├── docs/
│   │   └── openapi.yaml
│   ├── package.json
│   ├── public/
│   │   └── compilación de producción de Angular
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── validators/
├── docs/
│   ├── carbon-emission-records-docs.md
│   ├── diary.md
│   ├── extras.md
│   ├── openapi.yaml
│   └── postman/
│       ├── DGSIN-2526-10.postman_collection.json
│       ├── postman-run-results.png
│       └── newman-run-results.png
└── frontend/
    ├── angular.json
    ├── package.json
    └── src/
```

Nota: el archivo `docs/openapi.yaml` se mantiene como documentación del repositorio. Además, existe una copia en `backend/docs/openapi.yaml` para que Swagger UI pueda cargar la especificación en producción, ya que App Engine despliega desde la carpeta `backend`.

---

## Ejecución del backend

Desde la carpeta `backend`:

```bash
npm install
npm run dev
```

Backend local:

```txt
http://localhost:8080
```

Comprobaciones:

```txt
http://localhost:8080/api/v1
http://localhost:8080/api/v1/health
http://localhost:8080/api/v1/openapi
```

---

## Variables de entorno del backend

Crear un archivo local `backend/.env`:

```env
PORT=8080
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/dgsin-2526-10?retryWrites=true&w=majority
EMBER_API_KEY=YOUR_EMBER_API_KEY
```

El archivo `.env` no debe subirse a GitHub.

---

## Configuración de App Engine

El archivo real `app.yaml` no se incluye en el repositorio porque puede contener variables específicas del despliegue.

Se incluye una plantilla segura:

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

Despliegue desde la carpeta `backend`:

```bash
gcloud app deploy
```

---

## Ejecución del frontend

Desde la carpeta `frontend`:

```bash
npm install
ng serve
```

Frontend local:

```txt
http://localhost:4200
```

---

## Compilación de producción del frontend

Desde la carpeta `frontend`:

```bash
ng build
```

La compilación de Angular debe copiarse en:

```txt
backend/public/
```

Ejemplo desde `frontend`:

```powershell
New-Item -ItemType Directory -Force ..\backend\public
Remove-Item ..\backend\public\* -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item .\dist\frontend\browser\* ..\backend\public\ -Recurse
```

Esto permite que Express sirva el frontend Angular y la API REST desde el mismo despliegue de App Engine.

---

## API REST

Ruta base:

```txt
/api/v1
```

Recurso principal:

```txt
/api/v1/carbon-emission-records
```

Endpoints principales:

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/v1` | Devuelve un índice informativo de la API |
| GET | `/api/v1/health` | Comprueba el estado de la API |
| GET | `/api/v1/openapi` | Muestra la documentación OpenAPI renderizada con Swagger UI |
| GET | `/api/v1/carbon-emission-records` | Lista y filtra registros |
| POST | `/api/v1/carbon-emission-records` | Crea un nuevo registro |
| DELETE | `/api/v1/carbon-emission-records` | Borra todos los registros |
| GET | `/api/v1/carbon-emission-records/:id` | Obtiene un registro concreto |
| PUT | `/api/v1/carbon-emission-records/:id` | Actualiza un registro concreto |
| DELETE | `/api/v1/carbon-emission-records/:id` | Borra un registro concreto |
| GET | `/api/v1/carbon-emission-records/locations` | Devuelve las localizaciones disponibles |
| GET | `/api/v1/carbon-emission-records/loadInitialData` | Carga datos iniciales si la colección está vacía |
| GET | `/api/v1/carbon-emission-records/docs` | Redirige al portal público de documentación de Postman |
| GET | `/api/v1/integrations/supported-locations` | Devuelve localizaciones compatibles con la integración |
| GET | `/api/v1/integrations/renewable-electricity` | Devuelve datos integrados de CO₂ y electricidad |

Parámetros de consulta del listado:

| Parámetro | Descripción |
|---|---|
| `location` | Filtro flexible por localización |
| `period` | Año exacto |
| `fromPeriod` | Año inicial |
| `toPeriod` | Año final |
| `limit` | Número de registros por página |
| `offset` | Número de registros omitidos |

Ejemplo:

```http
GET /api/v1/carbon-emission-records?location=Spain&fromPeriod=2020&toPeriod=2023&limit=10&offset=0
```

---

## Documentación

Documentación específica del recurso:

```txt
docs/carbon-emission-records-docs.md
```

Portal público de Postman:

```txt
https://documenter.getpostman.com/view/15287747/2sBXwyG7Uk
```

Ruta de redirección a Postman:

```txt
GET /api/v1/carbon-emission-records/docs
```

Documentación OpenAPI visual con Swagger UI:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/openapi
```

Archivo OpenAPI del repositorio:

```txt
docs/openapi.yaml
```

Copia usada por el backend en App Engine:

```txt
backend/docs/openapi.yaml
```

---

## Pruebas con Postman y Newman

Colección Postman:

```txt
docs/postman/DGSIN-2526-10.postman_collection.json
```

Evidencia de ejecución con Postman:

```txt
docs/postman/postman-run-results.png
```

Evidencia de ejecución automatizada con Newman:

```txt
docs/postman/newman-run-results.png
```

Ejecutar Newman desde `backend`:

```bash
npm run test:postman
```

Las pruebas cubren:

- Health check.
- GET del conjunto.
- GET con filtros y paginación.
- POST correcto.
- POST duplicado con `409 Conflict`.
- POST inválido con `400 Bad Request` o `422 Unprocessable Entity`.
- GET de un recurso concreto.
- PUT de un recurso concreto.
- PUT con `_id` del cuerpo distinto al id de la URL.
- DELETE de un recurso concreto.
- DELETE del conjunto.
- GET de recurso borrado con `404 Not Found`.
- Método no permitido con `405 Method Not Allowed`.
- Carga de datos iniciales.
- Redirección a documentación.
- Endpoints de integración.

No se incluye evidencia de Insomnia en la entrega final.

---

## Rutas del frontend

| Ruta | Descripción |
|---|---|
| `/` | Página principal de registros |
| `/records/new` | Crear registro |
| `/records/:id/edit` | Editar registro |
| `/integrations` | Lista de integraciones disponibles |
| `/integrations/renewable-electricity` | Integración con Ember Energy |
| `/analytics` | Lista de widgets analíticos |
| `/documentation` | Página de documentación |
| `/about` | Información del proyecto y enlace/estado del vídeo |

---

## Funcionalidades del frontend

- Navegación mediante pestañas.
- Resaltado de la ruta activa.
- Listado de registros.
- Sugerencias de localización en creación y edición.
- Filtro por localización.
- Filtro por año exacto.
- Filtro por rango de años.
- Paginación con `limit` y `offset`.
- Selector de elementos por página.
- Acciones de búsqueda, limpieza y recarga.
- Crear registro.
- Editar registro.
- Borrar un registro.
- Borrar todos los registros.
- Cargar datos iniciales.
- Mensajes dinámicos de operación.
- Mensajes de error y éxito comprensibles.
- Visualizaciones con Highcharts.
- Integración externa mediante proxy backend.
- Página Documentation con enlaces a GitHub, App Engine, Postman y Swagger UI.
- Página About.

---

## Visualizaciones

La vista `/integrations/renewable-electricity` incluye tres gráficos con Highcharts:

| Gráfico | Fuente | Descripción |
|---|---|---|
| CO₂ emissions by year | API propia | Muestra emisiones de CO₂ por año |
| Ember electricity data by year | Ember Energy | Muestra datos anuales de electricidad |
| CO₂ emissions vs electricity generation | API propia + Ember | Compara ambas fuentes en un único gráfico |

Los datos de Ember se normalizan para obtener un único valor por año antes de representarlos. Esto evita que el eje temporal muestre años repetidos cuando la respuesta externa contiene varias filas por año.

La página `/analytics` enlaza directamente a estas visualizaciones usando parámetros por defecto:

```txt
location=Spain
fromPeriod=2020
toPeriod=2023
```

---

## Vídeo del proyecto

La ruta `/about` incluye el enlace o estado del vídeo.

Antes de publicar el vídeo final puede aparecer:

```txt
The project video link is pending.
```

Tras grabar y publicar el vídeo, se debe sustituir ese mensaje por la URL final.

---

## Actividades extra implementadas

1. **Paginación con `limit` y `offset`**
   - API: `GET /api/v1/carbon-emission-records?limit=10&offset=0`
   - Frontend: navegación anterior/siguiente y selector de elementos por página.

2. **Automatización de pruebas backend con Newman**
   - Script: `npm run test:postman`
   - Evidencia: `docs/postman/newman-run-results.png`

3. **OpenAPI Specification**
   - Archivo: `docs/openapi.yaml`
   - Vista visual con Swagger UI: `/api/v1/openapi`

Más detalles:

```txt
docs/extras.md
```

---

## Archivos de entrega

La actividad final requiere:

```txt
backend.zip
frontend.zip
summary.pdf
detailed.pdf
```

Generar los ZIP después del commit final:

```bash
git archive --format=zip --output=backend.zip --prefix=backend/ HEAD:backend
git archive --format=zip --output=frontend.zip --prefix=frontend/ HEAD:frontend
```

---

## Notas de seguridad

No subir a GitHub:

```txt
backend/.env
backend/app.yaml
backend/node_modules/
frontend/node_modules/
frontend/.angular/
```

Solo subir la plantilla segura:

```txt
backend/app.example.yaml
```
