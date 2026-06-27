# Documentación de la API carbon-emission-records

Ruta base del recurso:

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

El recurso `carbon-emission-records` almacena registros de emisiones de CO₂ por localización y año.

Ejemplo de recurso:

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

---

## 2. Campos

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---:|---|
| `_id` | String | Sí | ObjectId de MongoDB |
| `location` | String | Sí | Localización del dataset |
| `period` | Number | Sí | Año |
| `totalEmissionsMt` | Number | Sí | Emisiones totales de CO₂ en megatoneladas |
| `emissionsIntensity` | Number o null | No | Intensidad de emisiones |
| `emissionsPerCapita` | Number | Sí | Emisiones de CO₂ per cápita |
| `annualVariation` | Number o null | No | Variación anual |

La combinación `location` + `period` debe ser única.

---

## 3. POST sobre el conjunto de recursos

Crea un nuevo registro.

```http
POST /api/v1/carbon-emission-records
```

Cuerpo de petición:

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

Si el recurso ya existe:

```http
409 Conflict
```

```json
{
  "message": "A carbon emission record already exists for this location and period"
}
```

Si el JSON no contiene los campos esperados:

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

## 4. GET sobre el conjunto de recursos

Devuelve la colección de recursos.

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
| `offset` | Desplazamiento de paginación |

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

## 5. DELETE sobre el conjunto de recursos

Borra todos los registros.

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

## 6. GET sobre un recurso concreto

Obtiene un recurso por id.

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

Si el recurso no existe:

```http
404 Not Found
```

```json
{
  "message": "Carbon emission record not found"
}
```

---

## 7. PUT sobre un recurso concreto

Actualiza un recurso.

```http
PUT /api/v1/carbon-emission-records/:id
```

Cuerpo de petición:

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

## 8. PUT incorrecto con conflicto de identificador

Si el campo `_id` del cuerpo no coincide con el id indicado en la URL:

```http
PUT /api/v1/carbon-emission-records/68585f4f5c93c6ab1f2c1234
```

Cuerpo de petición:

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

Si la actualización genera una combinación duplicada de `location` y `period`:

```http
409 Conflict
```

```json
{
  "message": "A carbon emission record already exists for this location and period"
}
```

---

## 9. DELETE sobre un recurso concreto

Borra un recurso por id.

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

Si el recurso no existe:

```http
404 Not Found
```

```json
{
  "message": "Carbon emission record not found"
}
```

---

## 10. loadInitialData

Carga los datos iniciales únicamente si la colección está vacía.

```http
GET /api/v1/carbon-emission-records/loadInitialData
```

Si se cargan registros:

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

Si la colección ya tiene registros:

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

## 11. Redirección a documentación Postman

Redirige al portal público de documentación de Postman.

```http
GET /api/v1/carbon-emission-records/docs
```

Respuesta:

```http
302 Found
```

Destino:

```txt
https://documenter.getpostman.com/view/15287747/2sBXwyG7Uk
```

---

## 12. Documentación OpenAPI visual

El backend también expone una vista Swagger UI generada desde OpenAPI:

```http
GET /api/v1/openapi
```

URL desplegada:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/openapi
```

---

## 13. Método no permitido

Las rutas conocidas devuelven `405 Method Not Allowed` cuando se utiliza un método HTTP no soportado.

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

## 14. Códigos de estado

| Código | Significado |
|---:|---|
| `200 OK` | GET, PUT o DELETE correcto |
| `201 Created` | Recurso creado o datos iniciales cargados |
| `302 Found` | Redirección a documentación |
| `400 Bad Request` | Error de validación o id incorrecto |
| `404 Not Found` | Recurso no encontrado |
| `405 Method Not Allowed` | Método no permitido |
| `409 Conflict` | Recurso duplicado |
| `500 Internal Server Error` | Error del servidor |
