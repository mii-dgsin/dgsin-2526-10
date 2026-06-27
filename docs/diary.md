# Diario del proyecto DGSIN-2526-10

## Datos generales

Autora: **María Jesús Cadenas Sánchez**

Usuario GitHub:

```txt
mjcadenas
```

Repositorio:

```txt
https://github.com/mii-dgsin/dgsin-2526-10
```

Despliegue:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com
```

---

## Descripción

El proyecto es un sistema de información en la nube para gestionar y visualizar registros de emisiones de CO₂ por localización y año.

Incluye:

- API REST con Node.js y Express.
- Persistencia en MongoDB Atlas.
- Frontend Angular.
- CRUD completo.
- Paginación con `limit` y `offset`.
- Carga de datos iniciales.
- Integración externa con Ember Energy mediante proxy backend.
- Visualizaciones con Highcharts.
- Normalización de datos externos de Ember para agrupar valores por año.
- Pruebas Postman.
- Automatización de pruebas con Newman.
- Especificación OpenAPI.
- Swagger UI para visualizar la documentación OpenAPI.

---

## Avances de desarrollo

### Avance 1 - Definición del proyecto

Se definió el objetivo del proyecto: crear una aplicación cloud para consultar, gestionar y visualizar emisiones de CO₂.

Recurso elegido:

```txt
carbon-emission-records
```

---

### Avance 2 - Estructura del repositorio

Se creó la estructura:

```txt
backend/
frontend/
docs/
```

---

### Avance 3 - Backend inicial

Se creó el backend con Node.js y Express.

Endpoints iniciales:

```txt
GET /
GET /api/v1/health
```

---

### Avance 4 - MongoDB Atlas

Se configuró MongoDB Atlas como base de datos en la nube.

La conexión se separó en:

```txt
backend/src/config/db.js
```

---

### Avance 5 - Modelo de datos

Se creó el modelo `CarbonEmissionRecord` con Mongoose.

Campos principales:

- `location`
- `period`
- `totalEmissionsMt`
- `emissionsIntensity`
- `emissionsPerCapita`
- `annualVariation`

Se añadió unicidad por `location` y `period`.

---

### Avance 6 - API REST

Se implementó el recurso:

```txt
/api/v1/carbon-emission-records
```

Operaciones implementadas:

- POST colección.
- GET colección.
- DELETE colección.
- GET recurso concreto.
- PUT recurso concreto.
- DELETE recurso concreto.
- GET localizaciones.
- GET `loadInitialData`.
- GET redirección a documentación.

---

### Avance 7 - Carga de datos iniciales

Se creó el dataset inicial:

```txt
backend/data/carbonEmissionRecords.json
```

La ruta:

```txt
GET /api/v1/carbon-emission-records/loadInitialData
```

carga datos solo si la colección está vacía.

---

### Avance 8 - Validaciones y errores

La API controla:

- Campos obligatorios.
- Valores inválidos.
- Registros duplicados.
- Recursos no encontrados.
- Métodos no permitidos.
- PUT con `_id` del cuerpo distinto al id de la URL.

---

### Avance 9 - Modularización

El backend se separó en:

```txt
controllers/
routes/
models/
validators/
middlewares/
services/
config/
```

---

### Avance 10 - Despliegue en App Engine

La aplicación se desplegó en:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com
```

---

### Avance 11 - Frontend Angular

Se creó el frontend Angular y se conectó con la API desplegada.

---

### Avance 12 - Página principal de registros

Se implementó la página `Carbon Emission Records` con:

- Listado.
- Filtros.
- Paginación.
- Borrado individual.
- Borrado total.
- Carga inicial.
- Navegación a crear y editar.

---

### Avance 13 - Crear registro

Se añadió la ruta:

```txt
/records/new
```

El formulario incluye sugerencias de localización y permite introducir una localización nueva.

Se corrigió el campo de localización para que use `newRecord.location` como valor del formulario y `locations` únicamente como lista de sugerencias.

---

### Avance 14 - Editar registro

Se añadió la ruta:

```txt
/records/:id/edit
```

La edición se realiza en una vista separada del listado.

---

### Avance 15 - Mensajes de operación

Se añadieron mensajes específicos:

- Loading records...
- Deleting record...
- Deleting all records...
- Loading initial data...
- Refreshing records...

---

### Avance 16 - Integración externa con Ember Energy

Se implementó integración externa mediante proxy backend.

Endpoint:

```txt
/api/v1/integrations/renewable-electricity
```

---

### Avance 17 - Localizaciones soportadas

Se añadió:

```txt
GET /api/v1/integrations/supported-locations
```

para listar localizaciones compatibles entre el dataset local y Ember Energy.

---

### Avance 18 - Vista de integración

Se creó la ruta:

```txt
/integrations/renewable-electricity
```

Incluye selector de localización, rango de años, tablas y gráficos.

---

### Avance 19 - Normalización de datos externos para gráficos

Se ajustó la preparación de datos de Ember Energy para agrupar los registros externos por año antes de representarlos.

Esto evita que Highcharts muestre años repetidos cuando la API externa devuelve varias filas para el mismo año.

---

### Avance 20 - Analytics

Se añadió:

```txt
/analytics
```

como lista de visualizaciones disponibles.

---

### Avance 21 - Integrations

Se añadió:

```txt
/integrations
```

como índice de integraciones.

---

### Avance 22 - About

Se añadió:

```txt
/about
```

con información del proyecto y zona para el vídeo.

---

### Avance 23 - Documentation

Se añadió:

```txt
/documentation
```

con enlaces a GitHub, aplicación desplegada, Postman, Swagger UI y documentos del repositorio.

---

### Avance 24 - Visualizaciones Highcharts

Se añadieron tres gráficos:

- CO₂ emissions by year.
- Ember electricity data by year.
- CO₂ emissions vs Ember electricity data.

---

### Avance 25 - Pruebas Postman

Se creó una colección Postman para probar la API desplegada.

Las pruebas cubren operaciones correctas, errores básicos, duplicados, métodos no permitidos y endpoints de integración.

---

### Avance 26 - Mejoras de interfaz

Se mejoró:

- Cabecera con pestañas.
- Ruta activa.
- Filtros.
- Paginación.
- Favicon.
- Mensajes de operación.
- Página de documentación.
- Página About.

---

### Avance 27 - Angular servido desde backend

Se compiló Angular y se copió en:

```txt
backend/public/
```

para servir frontend y API desde el mismo App Engine.

---

### Avance 28 - Newman

Se añadió Newman y el script:

```txt
npm run test:postman
```

Evidencia:

```txt
docs/postman/newman-run-results.png
```

---

### Avance 29 - OpenAPI

Se creó:

```txt
docs/openapi.yaml
```

con la especificación OpenAPI 3.0.3.

---

### Avance 30 - Swagger UI

Se añadió Swagger UI en el backend para visualizar la especificación OpenAPI de forma gráfica:

```txt
GET /api/v1/openapi
```

Para que funcione en App Engine, se incluyó una copia del archivo OpenAPI en:

```txt
backend/docs/openapi.yaml
```

---

### Avance 31 - Ruta índice de API

Se añadió la ruta:

```txt
GET /api/v1
```

para devolver un índice informativo de los endpoints principales.

---

## Decisiones técnicas

- Express para una API REST modular.
- MongoDB Atlas como persistencia cloud.
- Angular Router para vistas separadas.
- Proxy backend para consumir Ember Energy sin exponer la clave externa en el frontend.
- Uso de `null` en valores no disponibles.
- Postman y Newman para pruebas.
- OpenAPI como documentación extra.
- Swagger UI para mostrar la especificación OpenAPI de forma visual.
- Copia de `openapi.yaml` en `backend/docs` porque el despliegue de App Engine se realiza desde `backend`.

---

## Registro de tiempo

El tiempo se ha registrado con Toggl.

La entrega incluye:

```txt
summary.pdf
detailed.pdf
```

---

## Estado del vídeo

El vídeo se añadirá al final.

La página `/about` debe actualizarse con el enlace final cuando esté publicado.
