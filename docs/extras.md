# Actividades extra

## Extra 1 - Paginación con limit y offset

La API implementa paginación mediante:

```txt
limit
offset
```

Ejemplo:

```http
GET /api/v1/carbon-emission-records?limit=10&offset=0
```

El frontend permite navegar con página anterior, página siguiente y selector de elementos por página.

Acceso:

```txt
/
```

Código relacionado:

```txt
backend/src/controllers/carbonEmissionRecord.controller.js
frontend/src/app/pages/records-page/
```

---

## Extra 2 - Automatización de pruebas backend con Newman

Se ha añadido Newman como dependencia de desarrollo del backend.

Comando:

```bash
cd backend
npm run test:postman
```

Este script ejecuta:

```txt
docs/postman/DGSIN-2526-10.postman_collection.json
```

Evidencia:

```txt
docs/postman/newman-run-results.png
```

---

## Extra 3 - OpenAPI Specification

La API se ha descrito usando OpenAPI 3.0.3.

Archivo:

```txt
docs/openapi.yaml
```

La especificación documenta:

- Health check.
- API `carbon-emission-records`.
- Operaciones sobre colección.
- Operaciones sobre recurso concreto.
- `loadInitialData`.
- Redirección a documentación.
- Endpoints de integración.
- Esquemas JSON.
