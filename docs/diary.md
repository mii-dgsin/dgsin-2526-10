# DGSIN-2526-10

## Equipo

[María Jesús Cadenas Sánchez](https://github.com/TU-USUARIO-GITHUB)

## Descripción del proyecto

El proyecto consistirá en desarrollar un sistema de información basado en microservicios para analizar la evolución de las emisiones de CO₂ por localización y año.

La aplicación permitirá consultar, visualizar, crear, editar y eliminar datos sobre emisiones contaminantes procedentes de una fuente de información no ofrecida directamente mediante una API pública. Estos datos incluirán emisiones totales, emisiones por habitante, intensidad de emisiones y variación anual.

En fases posteriores, el sistema se integrará con una API externa de datos energéticos para complementar la información disponible y permitir análisis comparativos relacionados con la transición energética.

## Repositorio

[mii-dgsin/DGSIN-2526-10](https://github.com/mii-dgsin/DGSIN-2526-10)

## URL

https://dgsin-2526-10-mjcadenas.ew.r.appspot.com

## APIs

Pendiente de documentación final.

---

# María Jesús Cadenas Sánchez - Fuente de datos

## Datos

`carbon-emission-records`

## Fuente de información

https://datosmacro.expansion.com/energia-y-medio-ambiente/emisiones-co2

## Descripción de la fuente

La fuente de información seleccionada contiene datos de emisiones de CO₂ por localización y año. Se trata de una página web con información estructurada en tablas HTML, por lo que los datos no se obtienen directamente desde una API pública propia de la fuente.

La fuente permite analizar la evolución de las emisiones contaminantes a nivel internacional, incluyendo información geográfica, información temporal y distintos indicadores relacionados con el volumen total de emisiones, las emisiones por habitante, la intensidad de emisiones y la variación anual.

La fuente cumple los requisitos indicados para el proyecto porque:

- No se utilizará como una API pública ya preparada.
- Tiene un campo geográfico: `location`.
- Tiene un campo temporal: `period`.
- Tiene más de tres campos adicionales de información.
- Los nombres de los campos están en inglés y en minúscula.
- El identificador `carbon-emission-records` está en plural, en inglés, en minúscula y solo contiene letras y guiones.

## Ejemplo de dato

| location | period | total-emissions-mt | emissions-intensity | emissions-per-capita | annual-variation |
|---|---:|---:|---:|---:|---:|
| Spain and Andorra | 2022 | 235.471 | 0.11 | 5.07 | -0.84 |

## Campos de la fuente

| Campo | Descripción |
|---|---|
| `location` | Localización original tal y como aparece en la fuente de información |
| `period` | Año del registro |
| `total-emissions-mt` | Emisiones totales de CO₂ en megatoneladas |
| `emissions-intensity` | Intensidad de emisiones |
| `emissions-per-capita` | Emisiones de CO₂ por habitante |
| `annual-variation` | Variación anual de las emisiones |

## Compatibilidad con otras fuentes

Para facilitar la integración posterior con una API externa de datos energéticos, se utilizarán dos dimensiones principales:

| Dimensión | Campo usado |
|---|---|
| Información geográfica | `location` |
| Información temporal | `period` |

Algunas localizaciones de la fuente pueden aparecer como valores compuestos. Por ejemplo, para España la fuente puede utilizar `Spain and Andorra`. Para no alterar el dato original, se conserva ese valor en el campo `location`.

Para facilitar las búsquedas, el backend implementa un filtro flexible por localización. Por ejemplo, al buscar `Spain`, la API puede devolver registros cuya localización original sea `Spain and Andorra`.

---

# Avances del proyecto

## Avance 1 - Definición inicial del proyecto

Se ha definido el objetivo principal del proyecto: construir un sistema de información en la nube para gestionar y analizar datos de emisiones de CO₂ por localización y año.

También se ha decidido que la fuente principal de datos será `carbon-emission-records`, basada en información obtenida desde la página de Datosmacro sobre emisiones de CO₂.

---

## Avance 2 - Creación del repositorio y estructura del proyecto

Se ha creado el repositorio del proyecto dentro de la organización de la asignatura:

[mii-dgsin/DGSIN-2526-10](https://github.com/mii-dgsin/DGSIN-2526-10)

Se ha organizado el proyecto separando backend, frontend y documentación:

```txt
DGSIN-2526-10/
├── .gitignore
├── README.md
├── backend/
├── docs/
└── frontend/
```

La carpeta `backend/` contiene la API REST, la carpeta `frontend/` contiene la aplicación Angular y la carpeta `docs/` contiene el diario y documentación del proyecto.

---

## Avance 3 - Creación del backend inicial

Se ha creado el backend inicial usando Node.js y Express dentro de la carpeta `backend/`.

Se han instalado las dependencias principales:

```txt
express
cors
dotenv
mongoose
nodemon
```

Se han creado los primeros endpoints de comprobación:

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/` | Devuelve un mensaje indicando que la API está en ejecución |
| GET | `/api/v1/health` | Comprueba que la API está funcionando correctamente |

---

## Avance 4 - Configuración de MongoDB Atlas

Se ha configurado la conexión del backend con MongoDB Atlas.

Se ha creado el archivo:

```txt
backend/src/config/db.js
```

También se ha configurado la variable de entorno `MONGODB_URI` en el archivo `.env`.

Durante la configuración se detectó un error de resolución DNS en la cadena de conexión de MongoDB Atlas:

```txt
querySrv ENOTFOUND _mongodb._tcp.cluster.g5cdqlu.mongodb.net
```

El problema se corrigió ajustando la URI de MongoDB Atlas.

---

## Avance 5 - Creación del modelo de datos

Se ha creado el modelo principal:

```txt
CarbonEmissionRecord
```

El archivo del modelo se encuentra en:

```txt
backend/src/models/carbonEmissionRecord.model.js
```

El modelo contiene los siguientes campos:

| Campo en MongoDB | Campo del diario | Tipo |
|---|---|---|
| `location` | `location` | String |
| `period` | `period` | Number |
| `totalEmissionsMt` | `total-emissions-mt` | Number |
| `emissionsIntensity` | `emissions-intensity` | Number o null |
| `emissionsPerCapita` | `emissions-per-capita` | Number |
| `annualVariation` | `annual-variation` | Number o null |

Se ha añadido una restricción para evitar registros duplicados con la misma combinación de `location` y `period`.

---

## Avance 6 - Creación del recurso REST

Se ha implementado el recurso REST:

```txt
/api/v1/carbon-emission-records
```

Endpoints implementados:

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/v1/carbon-emission-records` | Obtiene registros de emisiones |
| GET | `/api/v1/carbon-emission-records?location=Spain` | Filtra por localización |
| GET | `/api/v1/carbon-emission-records?period=2022` | Filtra por año |
| GET | `/api/v1/carbon-emission-records?fromPeriod=2020&toPeriod=2023` | Filtra por rango de años |
| GET | `/api/v1/carbon-emission-records/:id` | Obtiene un registro por ID |
| POST | `/api/v1/carbon-emission-records` | Crea un registro |
| PUT | `/api/v1/carbon-emission-records/:id` | Actualiza un registro |
| DELETE | `/api/v1/carbon-emission-records/:id` | Elimina un registro |

---

## Avance 7 - Carga inicial de datos

Se ha creado el archivo:

```txt
backend/data/carbonEmissionRecords.json
```

El JSON contiene registros con esta estructura:

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

También se ha creado un script de carga:

```txt
backend/src/scripts/loadCarbonEmissionRecords.js
```

Se ejecuta con:

```bash
npm run load:carbon
```

Durante esta fase se sustituyó `new: true` por `returnDocument: "after"` en las operaciones de actualización de Mongoose.

---

## Avance 8 - Pruebas iniciales de la API

Se han comenzado a realizar pruebas de la API usando Insomnia.

Pruebas realizadas:

| Método | Endpoint | Estado |
|---|---|---|
| GET | `/api/v1/health` | Probado |
| GET | `/api/v1/carbon-emission-records` | Probado |
| GET | `/api/v1/carbon-emission-records?location=Spain` | Probado |
| GET | `/api/v1/carbon-emission-records?period=2022` | Probado |
| POST | `/api/v1/carbon-emission-records` | Probado inicialmente |
| PUT | `/api/v1/carbon-emission-records/:id` | Pendiente de documentar |
| DELETE | `/api/v1/carbon-emission-records/:id` | Pendiente de documentar |

---

## Avance 9 - Organización de documentación

Se ha creado la carpeta `docs/` para guardar la documentación del proyecto:

```txt
docs/
├── diary.md
└── postman/
```

Aunque durante el desarrollo se está utilizando Insomnia, se mantiene la carpeta `postman/` por si posteriormente es necesario incluir documentación compatible con Postman.

---

## Avance 10 - Validación y control de errores

Se ha añadido una capa de validación para el recurso `carbon-emission-records`.

También se ha añadido un middleware para gestionar rutas no encontradas, devolviendo una respuesta JSON con código HTTP 404 cuando se solicita un endpoint inexistente.

---

## Avance 11 - Preparación para Google App Engine

Se ha preparado el backend para su despliegue en Google App Engine.

Se ha creado una plantilla:

```txt
backend/app.example.yaml
```

El archivo real `app.yaml` no se subirá al repositorio porque puede contener credenciales reales de MongoDB Atlas.

---

## Avance 12 - Despliegue del backend en Google App Engine

Se ha desplegado el backend del proyecto en Google App Engine.

La aplicación se encuentra disponible en:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com
```

Durante el despliegue se resolvieron incidencias relacionadas con:

- Facturación del proyecto de Google Cloud.
- Permisos sobre el bucket de staging de App Engine.
- Acceso de red desde App Engine hacia MongoDB Atlas.

Endpoints verificados:

| Método | Endpoint | Estado |
|---|---|---|
| GET | `/` | Probado |
| GET | `/api/v1/health` | Probado |
| GET | `/api/v1/carbon-emission-records` | Probado |
| GET | `/api/v1/carbon-emission-records?location=Spain` | Probado |

---

## Avance 13 - Corrección del filtrado por localización

Se ha corregido el filtrado de registros por localización en el recurso `carbon-emission-records`.

Durante las pruebas se detectó que la fuente original utiliza valores de localización compuestos en algunos casos, como `Spain and Andorra`. Esto hacía que una búsqueda exacta por `Spain` no devolviera resultados.

Para resolverlo, se ha modificado el controlador para que el parámetro `location` realice una búsqueda flexible sobre el campo `location`.

De esta forma, una consulta como:

```txt
GET /api/v1/carbon-emission-records?location=Spain
```

puede encontrar y devolver registros cuya localización original sea:

```txt
Spain and Andorra
```

También sigue siendo posible buscar directamente por el valor completo de la fuente:

```txt
GET /api/v1/carbon-emission-records?location=Spain%20and%20Andorra
```

La corrección se ha probado correctamente tanto en local como en la API desplegada en Google App Engine.

---

## Avance 14 - Ampliación de datos y filtros por periodo

Se ha ampliado el conjunto inicial de datos de emisiones de CO₂ con más registros por localización y año.

También se ha mejorado el endpoint `GET /api/v1/carbon-emission-records` para permitir búsquedas más flexibles mediante filtros por localización, año concreto y rango de años.

Nuevos parámetros soportados:

| Parámetro | Descripción |
|---|---|
| `location` | Filtra por localización mediante búsqueda flexible |
| `period` | Filtra por un año concreto |
| `fromPeriod` | Filtra desde un año inicial |
| `toPeriod` | Filtra hasta un año final |
| `limit` | Limita el número de registros devueltos |
| `offset` | Permite paginar los resultados |

Estos cambios preparan la API para ser consumida posteriormente desde el frontend Angular.

---

## Avance 15 - Creación del frontend Angular

Se ha creado el frontend del proyecto con Angular dentro de la carpeta `frontend/`.

Durante la creación del proyecto se decidió no activar SSR/SSG, ya que el objetivo inicial es desarrollar una aplicación SPA sencilla que consuma la API REST desplegada en Google App Engine.

También se decidió no compartir métricas de uso con Angular.

---

## Avance 16 - Conexión inicial del frontend con la API

Se ha creado un servicio Angular para consumir el endpoint desplegado de la API:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/carbon-emission-records
```

También se ha creado un modelo TypeScript para representar los registros de emisiones de CO₂.

La primera pantalla del frontend muestra una tabla con los registros obtenidos desde la API y permite filtrar por localización, año concreto y rango de años.

Durante esta fase se detectó un error de Angular relacionado con Zone.js:

```txt
NG0908: In this configuration Angular requires Zone.js
```

El problema se resolvió instalando `zone.js` y cargándolo desde `main.ts`.

Con esto, el frontend ya muestra datos reales obtenidos desde el backend desplegado en App Engine.

---
## Avance 17 - Mejoras en el frontend Angular

Se han realizado varias mejoras en el frontend Angular para facilitar la consulta de los registros de emisiones de CO₂.

En primer lugar, se ha añadido paginación a la tabla de resultados. La API ya soportaba los parámetros `limit` y `offset`, por lo que el frontend se ha actualizado para permitir navegar entre páginas de resultados sin cargar todos los registros de una sola vez.

También se ha añadido un selector de tamaño de página, permitiendo mostrar 25, 50 o 100 registros por página.

Además, se ha mejorado el comportamiento de los filtros. Ahora, al escribir en los campos de búsqueda, la tabla se actualiza automáticamente tras un breve retardo, sin necesidad de pulsar siempre el botón de búsqueda. Aun así, se mantiene el botón `Search` para poder forzar manualmente la consulta.

Se han añadido restricciones a los campos de año para evitar búsquedas fuera del rango disponible en el conjunto de datos. Actualmente, los años permitidos están comprendidos entre 1970 y 2023. También se valida que el campo `From year` no sea mayor que el campo `To year`.

Se ha añadido un botón de recarga y se han mejorado los mensajes visuales de estado, mostrando el número total de registros, la página actual y el rango de registros visible.

Por último, se ha comenzado a preparar la tabla para acciones CRUD desde el frontend. Se ha añadido una columna de acciones y se ha incorporado Font Awesome para mostrar iconos en lugar de texto plano, por ejemplo usando un icono de papelera para la acción de borrado.

Durante esta fase también se corrigió un aviso de TypeScript 6 en `tsconfig.app.json`, añadiendo explícitamente la propiedad `rootDir` para indicar que el directorio fuente común de la aplicación es `./src`.
---
## Avance 18 - Creación de registros desde Angular

Se ha añadido al frontend Angular un formulario para crear nuevos registros de emisiones de CO₂.

El formulario permite introducir los campos principales del recurso `carbon-emission-records`:

| Campo                | Descripción                               |
| -------------------- | ----------------------------------------- |
| `location`           | Localización del registro                 |
| `period`             | Año del registro                          |
| `totalEmissionsMt`   | Emisiones totales de CO₂ en megatoneladas |
| `emissionsIntensity` | Intensidad de emisiones                   |
| `emissionsPerCapita` | Emisiones por habitante                   |
| `annualVariation`    | Variación anual de emisiones              |

Desde Angular se envía una petición `POST` al endpoint desplegado en Google App Engine:

```txt
POST /api/v1/carbon-emission-records
```

Durante esta fase se detectó inicialmente un error `400 Bad Request` al crear registros desde el frontend. El error estaba relacionado con la validación de los datos enviados al backend. Tras revisar el cuerpo de la petición y la validación del recurso, se corrigió el problema y la creación de registros desde Angular quedó funcionando correctamente.

Una vez creado un registro, el formulario se limpia, se oculta y la tabla se recarga automáticamente para mostrar los datos actualizados.

Con este avance, el frontend ya permite consultar, filtrar, paginar y crear registros de emisiones desde la interfaz web.
---

# Decisiones técnicas tomadas

## Uso de Node.js y Express

Se ha decidido utilizar Node.js con Express para implementar el backend REST.

## Uso de MongoDB Atlas

Se ha decidido utilizar MongoDB Atlas como base de datos en la nube.

## Separación entre backend y frontend

El proyecto se ha estructurado separando backend y frontend en carpetas independientes.

## Uso del campo `location`

Se ha decidido mantener el campo `location` tal y como aparece en la fuente de información.

Para facilitar la búsqueda, el backend implementa un filtro flexible por localización. Así, una búsqueda por `Spain` puede devolver registros cuya localización original sea `Spain and Andorra`.

## Uso de Insomnia para pruebas

Se está utilizando Insomnia para probar los endpoints de la API durante el desarrollo.

---

# Próximos pasos

1. Completar las pruebas de todos los endpoints CRUD.
2. Revisar y completar la documentación de la API.
3. Mejorar el diseño visual del frontend Angular.
4. Añadir operaciones de creación, edición y eliminación desde Angular.
5. Integrar una API externa de datos energéticos.
6. Añadir visualizaciones de datos.
7. Actualizar el diario con cada avance realizado.

---

# Registro de tiempos

Los tiempos de trabajo se irán registrando en Toggl.

| Fecha | Tarea | Tiempo |
|---|---|---|
| Pendiente | Definición inicial del proyecto y fuente de datos | Pendiente |
| Pendiente | Creación del repositorio y estructura inicial | Pendiente |
| Pendiente | Creación del backend con Express | Pendiente |
| Pendiente | Configuración de MongoDB Atlas | Pendiente |
| Pendiente | Implementación del recurso `carbon-emission-records` | Pendiente |
| Pendiente | Creación del script de carga de datos | Pendiente |
| Pendiente | Pruebas iniciales con Insomnia | Pendiente |
| Pendiente | Preparación y despliegue en App Engine | Pendiente |
| Pendiente | Creación del frontend Angular | Pendiente |
| Pendiente | Conexión del frontend con la API | Pendiente |
