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

---

## Aplicación desplegada

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com
```

El mismo despliegue de App Engine sirve:

- El frontend desarrollado con Angular.
- La API REST desarrollada con Node.js y Express.
- La compilación estática de Angular desde `backend/public`.
- El proxy backend utilizado para la integración externa.

URL base de la API:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1
```

Ruta informativa de la API:

```txt
GET /api/v1
```

Esta ruta devuelve un JSON con los principales recursos disponibles de la API.

---

## Objetivo del proyecto

El objetivo del proyecto es proporcionar una aplicación cloud que permita gestionar registros de emisiones de CO₂ y compararlos con una fuente externa de datos de generación eléctrica anual.

El recurso principal es:

```txt
carbon-emission-records
```

El nombre del recurso cumple las restricciones indicadas:

- Solo minúsculas.
- Uso de guiones.
- Sin espacios.
- No más de tres palabras.

---

## Fuente de datos

Fuente principal:

```txt
https://datosmacro.expansion.com/energia-y-medio-ambiente/emisiones-co2
```

La fuente contiene información de emisiones de CO₂ por localización y año. El proyecto almacena los datos seleccionados en MongoDB Atlas y los expone mediante una API REST propia.

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

La llamada a la API externa se realiza mediante un proxy propio en el backend:

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

### Frontend

- Angular
- Angular Router
- TypeScript
- FormsModule
- Font Awesome
- Highcharts
- CSS responsive

---

## Estructura del proyecto

```txt
dgsin-2526-10/
├── README.md
├── backend/
│   ├── app.example.yaml
│   ├── data/
│   │   └── carbonEmissionRecords.json
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
        ├── assets/
        │   └── favicon.webp
        ├── index.html
        └── app/
            ├── models/
            ├── pages/
            └── services/
```

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
```

---

## Variables de entorno del backend

Crear un archivo local `backend/.env`:

```env
PORT=8080
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/dgsin-2526-10?retryWrites=true&w=majority
EMBER_API_KEY=YOUR_EMBER_API_KEY
```

---

## Configuración de App Engine

El archivo real `app.yaml` no se incluye en el repositorio porque puede contener variables específicas del despliegue.

Se incluye una plantilla segura:

```txt
backend/app.example.yaml
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
| GET | `/api/v1/carbon-emission-records` | Lista y filtra registros |
| POST | `/api/v1/carbon-emission-records` | Crea un nuevo registro |
| DELETE | `/api/v1/carbon-emission-records` | Borra todos los registros |
| GET | `/api/v1/carbon-emission-records/:id` | Obtiene un registro concreto |
| PUT | `/api/v1/carbon-emission-records/:id` | Actualiza un registro concreto |
| DELETE | `/api/v1/carbon-emission-records/:id` | Borra un registro concreto |
| GET | `/api/v1/carbon-emission-records/locations` | Devuelve las localizaciones disponibles |
| GET | `/api/v1/carbon-emission-records/loadInitialData` | Carga datos iniciales si la colección está vacía |
| GET | `/api/v1/carbon-emission-records/docs` | Redirige al portal público de documentación de Postman |

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

## Documentación obligatoria de la API

La documentación específica del recurso se encuentra en:

```txt
docs/carbon-emission-records-docs.md
```

Portal público de documentación de Postman:

```txt
https://documenter.getpostman.com/view/15287747/2sBXwyF6es
```

Ruta de redirección:

```txt
GET /api/v1/carbon-emission-records/docs
```

---

## OpenAPI

La API también está documentada mediante OpenAPI 3.0.3.

Archivo:

```txt
docs/openapi.yaml
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

Las pruebas cubren operaciones CRUD, errores básicos, duplicados, métodos no permitidos, carga inicial, redirección a documentación e integración externa.

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
- Sugerencias de localización.
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
- Visualizaciones con Highcharts.
- Integración externa mediante proxy backend.
- Páginas Documentation y About.

---

## Visualizaciones

La vista `/integrations/renewable-electricity` incluye tres gráficos con Highcharts:

| Gráfico | Fuente | Descripción |
|---|---|---|
| CO₂ emissions by year | API propia | Muestra emisiones de CO₂ por año |
| Ember electricity data by year | Ember Energy | Muestra datos anuales de electricidad |
| CO₂ emissions vs electricity generation | API propia + Ember | Compara ambas fuentes en un único gráfico |

---

## Vídeo del proyecto

La ruta `/about` incluye el enlace o estado del vídeo.

Antes de publicar el vídeo final puede aparecer:

```txt
The project video link is pending.
```


---

## Actividades extra implementadas

1. **Paginación con `limit` y `offset`**.
2. **Automatización de pruebas backend con Newman**.
3. **OpenAPI Specification**.

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

## Notas de seguridad

No se suben a GitHub lo siguientes archivos:
 
```txt
backend/.env
backend/app.yaml
backend/node_modules/
frontend/node_modules/
frontend/.angular/
```

Solo subirá la plantilla segura:

```txt
backend/app.example.yaml
```
