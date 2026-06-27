# Actividades extra

Este documento describe las actividades extra implementadas individualmente en el proyecto.

---

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

El frontend ofrece controles de paginación en la página principal:

```txt
/
```

El usuario puede:

- Seleccionar el número de registros por página.
- Ir a la página siguiente.
- Ir a la página anterior.
- Ver el rango actual de registros mostrados.

Código relacionado:

```txt
backend/src/controllers/carbonEmissionRecord.controller.js
frontend/src/app/pages/records-page/
```

---

## Extra 2 - Automatización de pruebas de backend con Newman

Se ha añadido Newman para automatizar la ejecución de la colección Postman.

Script:

```txt
backend/package.json
```

Comando:

```bash
cd backend
npm run test:postman
```

El script ejecuta:

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

Archivo de documentación del repositorio:

```txt
docs/openapi.yaml
```

Copia usada por el backend desplegado:

```txt
backend/docs/openapi.yaml
```

Además, la especificación se visualiza con Swagger UI en:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/openapi
```

La especificación documenta:

- Health check.
- API `carbon-emission-records`.
- Operaciones requeridas sobre colección y recurso concreto.
- Ruta `loadInitialData`.
- Redirección a documentación Postman.
- Códigos de estado relevantes.
- Endpoints de integración.
- Esquemas JSON de petición y respuesta.
