# Documentación de la API carbon-emission-records

Ruta base:

```txt
/api/v1/carbon-emission-records
```

URL desplegada:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/carbon-emission-records
```

Este documento describe las operaciones REST requeridas para el recurso `carbon-emission-records`.

---

## 1. Descripción del recurso

El recurso almacena registros de emisiones de CO₂ por localización y año.

Ejemplo:

```json
{
  "_id": "68585f4f5c93c6ab1f2c1234",
  "location": "Spain and Andorra",
  "period": 2022,
  "totalEmissionsMt": 235.471,
  "emissionsIntensity": 0.11,
  "emissionsPerCapita": 5.07,
  "annualVariation": -0.84
}
```

Campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---:|---|
| `_id` | String | Sí | ObjectId de MongoDB |
| `location` | String | Sí | Localización |
| `period` | Number | Sí | Año |
| `totalEmissionsMt` | Number | Sí | Emisiones totales de CO₂ |
| `emissionsIntensity` | Number o null | No | Intensidad de emisiones |
| `emissionsPerCapita` | Number | Sí | Emisiones per cápita |
| `annualVariation` | Number o null | No | Variación anual |

La combinación `location` + `period` debe ser única.

---

## 2. POST sobre el conjunto

```http
POST /api/v1/carbon-emission-records
```

Cuerpo:

```json
{
  "location": "Spain and Andorra",
  "period": 2026,
  "totalEmissionsMt": 2,
  "emissionsIntensity": 2,
  "emissionsPerCapita": 21,
  "annualVariation": 2
}
```

Respuesta correcta:

```http
201 Created
```

```json
{
  "_id": "68585f4f5c93c6ab1f2c9999",
  "location": "Spain and Andorra",
  "period": 2026,
  "totalEmissionsMt": 2,
  "emissionsIntensity": 2,
  "emissionsPerCapita": 21,
  "annualVariation": 2
}
```

Recurso duplicado:

```http
409 Conflict
```

```json
{
  "message": "A carbon emission record already exists for this location and period"
}
```

JSON incorrecto:

```http
400 Bad Request
```

```json
{
  "message": "Validation error",
  "errors": [
    "location is required",
    "period must be a valid year"
  ]
}
```

---

## 3. GET sobre el conjunto

```http
GET /api/v1/carbon-emission-records
```

Parámetros opcionales:

| Parámetro | Descripción |
|---|---|
| `location` | Búsqueda flexible por localización |
| `period` | Año exacto |
| `fromPeriod` | Año inicial |
| `toPeriod` | Año final |
| `limit` | Tamaño de página |
| `offset` | Desplazamiento |

Ejemplo:

```http
GET /api/v1/carbon-emission-records?location=Spain&fromPeriod=2020&toPeriod=2023&limit=10&offset=0
```

Respuesta:

```http
200 OK
```

```json
{
  "total": 4,
  "limit": 10,
  "offset": 0,
  "records": [
    {
      "_id": "68585f4f5c93c6ab1f2c1234",
      "location": "Spain and Andorra",
      "period": 2022,
      "totalEmissionsMt": 235.471,
      "emissionsIntensity": 0.11,
      "emissionsPerCapita": 5.07,
      "annualVariation": -0.84
    }
  ]
}
```

---

## 4. DELETE sobre el conjunto

```http
DELETE /api/v1/carbon-emission-records
```

Respuesta:

```http
200 OK
```

```json
{
  "message": "Carbon emission records deleted successfully",
  "deleted": 1200
}
```

---

## 5. GET sobre un recurso concreto

```http
GET /api/v1/carbon-emission-records/:id
```

Respuesta correcta:

```http
200 OK
```

```json
{
  "_id": "68585f4f5c93c6ab1f2c1234",
  "location": "Spain and Andorra",
  "period": 2022,
  "totalEmissionsMt": 235.471,
  "emissionsIntensity": 0.11,
  "emissionsPerCapita": 5.07,
  "annualVariation": -0.84
}
```

Si no existe:

```http
404 Not Found
```

```json
{
  "message": "Carbon emission record not found"
}
```

---

## 6. PUT sobre un recurso concreto

```http
PUT /api/v1/carbon-emission-records/:id
```

Cuerpo:

```json
{
  "_id": "68585f4f5c93c6ab1f2c1234",
  "location": "Spain and Andorra",
  "period": 2026,
  "totalEmissionsMt": 3,
  "emissionsIntensity": null,
  "emissionsPerCapita": 22,
  "annualVariation": null
}
```

Respuesta:

```http
200 OK
```

---

## 7. PUT incorrecto con conflicto de id

Si el `_id` del cuerpo no coincide con el id de la URL:

```json
{
  "_id": "000000000000000000000000",
  "location": "Spain and Andorra",
  "period": 2026,
  "totalEmissionsMt": 3,
  "emissionsIntensity": null,
  "emissionsPerCapita": 22,
  "annualVariation": null
}
```

Respuesta:

```http
400 Bad Request
```

```json
{
  "message": "The request body id must match the URL resource id"
}
```

Si la actualización genera un duplicado:

```http
409 Conflict
```

```json
{
  "message": "A carbon emission record already exists for this location and period"
}
```

---

## 8. DELETE sobre un recurso concreto

```http
DELETE /api/v1/carbon-emission-records/:id
```

Respuesta:

```http
200 OK
```

```json
{
  "message": "Carbon emission record deleted successfully"
}
```

Si no existe:

```http
404 Not Found
```

---

## 9. loadInitialData

```http
GET /api/v1/carbon-emission-records/loadInitialData
```

Si carga datos:

```http
201 Created
```

```json
{
  "message": "Initial carbon emission records loaded successfully",
  "loaded": true,
  "inserted": 1200,
  "total": 1200
}
```

Si ya hay datos:

```http
200 OK
```

```json
{
  "message": "Database already contains carbon emission records",
  "loaded": false,
  "inserted": 0,
  "total": 1200
}
```

---

## 10. Redirección a documentación

```http
GET /api/v1/carbon-emission-records/docs
```

Respuesta:

```http
302 Found
```

Destino:

```txt
https://documenter.getpostman.com/view/15287747/2sBXwyF6es
```

---

## 11. Método no permitido

Ejemplo:

```http
PATCH /api/v1/carbon-emission-records
```

Respuesta:

```http
405 Method Not Allowed
```

```json
{
  "message": "Method not allowed for this endpoint",
  "method": "PATCH",
  "path": "/api/v1/carbon-emission-records"
}
```

---

## 12. Códigos de estado

| Código | Uso |
|---:|---|
| 200 | Operación correcta |
| 201 | Recurso creado o datos iniciales cargados |
| 302 | Redirección |
| 400 | Petición incorrecta |
| 404 | Recurso no encontrado |
| 405 | Método no permitido |
| 409 | Conflicto por duplicado |
| 500 | Error de servidor |
