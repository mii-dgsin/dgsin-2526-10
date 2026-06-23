# DGSIN-2526-10

## Equipo

[María Jesús Cadenas Sánchez](https://github.com/mjcadenas)

## Descripción del proyecto

El proyecto consiste en desarrollar un sistema de información en la nube para analizar la evolución de las emisiones de CO₂ por localización y año.

La aplicación permite consultar, filtrar, crear, editar y eliminar registros de emisiones contaminantes procedentes de una fuente de información que no se consume directamente mediante una API pública propia. Los datos incluyen emisiones totales, emisiones por habitante, intensidad de emisiones y variación anual.

En una fase posterior, el sistema podrá integrarse con una API externa de datos energéticos para complementar la información disponible y permitir comparaciones relacionadas con la transición energética.

## Repositorio

[mii-dgsin/DGSIN-2526-10](https://github.com/mii-dgsin/dgsin-2526-10)

## URL

https://dgsin-2526-10-mjcadenas.ew.r.appspot.com

## APIs

Pendiente de documentación final con colección de pruebas y/o portal de documentación.

---

# María Jesús Cadenas Sánchez - Fuente de datos

## Datos

`carbon-emission-records`

## Fuente de información

https://datosmacro.expansion.com/energia-y-medio-ambiente/emisiones-co2

## Descripción de la fuente

La fuente de información seleccionada contiene datos de emisiones de CO₂ por localización y año. Se trata de una página web con información estructurada en tablas HTML, por lo que los datos no se obtienen directamente desde una API pública propia de la fuente.

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

## Tratamiento de valores no disponibles

Algunos registros pueden no disponer de todos los indicadores. En esos casos se utiliza `null` para representar datos no disponibles.

Los campos `emissionsIntensity` y `annualVariation` pueden ser `null`. En la tabla del frontend se muestran como `N/A`. No se sustituyen por `0`, porque `0` indica un valor real y `null` indica ausencia de dato.

## Compatibilidad con otras fuentes

Para una futura integración con una API externa de datos energéticos, se utilizarán dos dimensiones principales:

| Dimensión | Campo usado |
|---|---|
| Información geográfica | `location` |
| Información temporal | `period` |

Algunas localizaciones pueden aparecer como valores compuestos. Por ejemplo, para España la fuente puede utilizar `Spain and Andorra`. Para no alterar el dato original, se conserva ese valor en `location`.

Para facilitar las búsquedas, el backend implementa un filtro flexible por localización. Así, al buscar `Spain`, la API puede devolver registros cuya localización original sea `Spain and Andorra`.

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

---

## Avance 3 - Creación del backend inicial

Se ha creado el backend inicial usando Node.js y Express dentro de la carpeta `backend/`.

Se han instalado dependencias principales como `express`, `cors`, `dotenv`, `mongoose` y `nodemon`.

Se han creado los endpoints iniciales:

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/` | Devuelve un mensaje indicando que la API está en ejecución |
| GET | `/api/v1/health` | Comprueba que la API está funcionando |

---

## Avance 4 - Configuración de MongoDB Atlas

Se ha configurado la conexión del backend con MongoDB Atlas.

Se ha creado el archivo `backend/src/config/db.js` y se ha configurado la variable `MONGODB_URI` en `.env`.

Durante la configuración se detectó un error de resolución DNS en la cadena de conexión de MongoDB Atlas. El problema se corrigió ajustando la URI de conexión.

---

## Avance 5 - Creación del modelo de datos

Se ha creado el modelo `CarbonEmissionRecord` en `backend/src/models/carbonEmissionRecord.model.js`.

El modelo contiene los campos:

| Campo en MongoDB | Tipo |
|---|---|
| `location` | String |
| `period` | Number |
| `totalEmissionsMt` | Number |
| `emissionsIntensity` | Number o null |
| `emissionsPerCapita` | Number |
| `annualVariation` | Number o null |

Se ha añadido una restricción para evitar registros duplicados con la misma combinación de `location` y `period`.

---

## Avance 6 - Creación del recurso REST

Se ha implementado el recurso REST `/api/v1/carbon-emission-records`.

Endpoints implementados:

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/v1/carbon-emission-records` | Obtiene registros de emisiones |
| GET | `/api/v1/carbon-emission-records/:id` | Obtiene un registro por ID |
| POST | `/api/v1/carbon-emission-records` | Crea un registro |
| PUT | `/api/v1/carbon-emission-records/:id` | Actualiza un registro |
| DELETE | `/api/v1/carbon-emission-records/:id` | Elimina un registro |

También se han añadido filtros por localización, año, rango de años, límite y desplazamiento.

---

## Avance 7 - Carga inicial de datos

Se ha creado el archivo `backend/data/carbonEmissionRecords.json`.

Los datos se cargan en MongoDB mediante el script:

```bash
npm run load:carbon
```

Durante esta fase se sustituyó `new: true` por `returnDocument: "after"` en las operaciones de actualización de Mongoose.

---

## Avance 8 - Pruebas iniciales de la API

Se han comenzado a realizar pruebas de la API usando Insomnia.

Se han probado peticiones `GET`, `POST`, `PUT` y `DELETE`, así como filtros por localización y año.

---

## Avance 9 - Organización de documentación

Se ha creado la carpeta `docs/` para guardar el diario y documentación del proyecto:

```txt
docs/
├── diary.md
└── postman/
```

Aunque durante el desarrollo se utiliza Insomnia, se mantiene la carpeta `postman/` por si posteriormente es necesario incluir documentación compatible con Postman.

---

## Avance 10 - Validación y control de errores

Se ha añadido una capa de validación para el recurso `carbon-emission-records`.

También se ha añadido un middleware para gestionar rutas no encontradas con respuesta JSON y código HTTP 404.

Además, se ha tratado el error de duplicado cuando ya existe un registro con la misma combinación de `location` y `period`.

---

## Avance 11 - Preparación para Google App Engine

Se ha preparado el backend para su despliegue en Google App Engine.

Se ha creado la plantilla `backend/app.example.yaml`.

El archivo real `app.yaml` no se subirá al repositorio porque puede contener credenciales reales de MongoDB Atlas.

---

## Avance 12 - Despliegue del backend en Google App Engine

Se ha desplegado el backend del proyecto en Google App Engine.

La aplicación se encuentra disponible en:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com
```

Durante el despliegue se resolvieron incidencias relacionadas con facturación, permisos sobre el bucket de staging y acceso de red desde App Engine hacia MongoDB Atlas.

---

## Avance 13 - Corrección del filtrado por localización

Se ha corregido el filtrado de registros por localización.

La fuente puede usar valores compuestos como `Spain and Andorra`. Por eso se ha implementado un filtro flexible sobre el campo `location`.

De esta forma, una consulta como:

```txt
GET /api/v1/carbon-emission-records?location=Spain
```

puede devolver registros cuya localización original sea `Spain and Andorra`.

---

## Avance 14 - Ampliación de datos y filtros por periodo

Se ha ampliado el conjunto inicial de datos de emisiones de CO₂ con más registros por localización y año.

También se ha mejorado el endpoint `GET /api/v1/carbon-emission-records` para permitir búsquedas por localización, año concreto, rango de años, límite y desplazamiento.

---

## Avance 15 - Creación del frontend Angular

Se ha creado el frontend con Angular dentro de la carpeta `frontend/`.

Durante la creación del proyecto se decidió no activar SSR/SSG, ya que el objetivo inicial es desarrollar una aplicación SPA sencilla que consuma la API REST desplegada en Google App Engine.

---

## Avance 16 - Conexión inicial del frontend con la API

Se ha creado un servicio Angular para consumir el endpoint desplegado de la API:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/carbon-emission-records
```

También se ha creado un modelo TypeScript para representar los registros.

Durante esta fase se detectó un error de Angular relacionado con Zone.js. El problema se resolvió instalando `zone.js` y cargándolo desde `main.ts`.

---

## Avance 17 - Mejoras en el frontend Angular

Se han añadido mejoras al frontend:

- Paginación con `limit` y `offset`.
- Selector de tamaño de página: 25, 50 o 100 registros.
- Filtros automáticos al escribir.
- Validación de años entre 1970 y el año actual.
- Botón de recarga.
- Mensajes de estado.
- Iconos mediante Font Awesome.
- Corrección de TypeScript 6 en `tsconfig.app.json` añadiendo `rootDir: "./src"`.

---

## Avance 18 - Creación de registros desde Angular

Se ha añadido al frontend Angular la posibilidad de crear nuevos registros de emisiones de CO₂.

Inicialmente la creación se planteó dentro de la vista de listado, pero posteriormente se decidió moverla a una vista separada para mejorar la organización y acercarse mejor a los criterios de la rúbrica.

El formulario permite introducir `location`, `period`, `totalEmissionsMt`, `emissionsIntensity`, `emissionsPerCapita` y `annualVariation`.

Desde Angular se envía una petición:

```txt
POST /api/v1/carbon-emission-records
```

También se ha mejorado la gestión de errores para mostrar en pantalla mensajes devueltos por el backend, como el error de registro duplicado.

---

## Avance 19 - Edición de registros en una vista separada con Angular Router

Se ha refactorizado el frontend Angular para utilizar Angular Router y separar la vista de listado de la vista de edición.

La aplicación cuenta ahora con una vista principal donde se muestran los registros de emisiones de CO₂ en una tabla con filtros, paginación y acciones sobre cada registro.

La vista de edición se encuentra en:

```txt
/records/:id/edit
```

En esta vista se cargan los datos actuales del registro mediante una petición `GET` por identificador y se muestran en un formulario independiente. Al guardar los cambios, Angular envía una petición:

```txt
PUT /api/v1/carbon-emission-records/:id
```

Con este cambio, el frontend permite editar recursos en una vista distinta a la lista y utiliza Angular Router para organizar la navegación.

---

## Avance 20 - Creación de registros en una vista separada y mejora de mensajes de error

Se ha añadido una vista específica para crear registros, accesible desde la ruta:

```txt
/records/new
```

La vista principal ya no contiene el formulario de creación directamente. En su lugar, muestra un botón `New record` que redirige al formulario de alta.

También se han corregido problemas de refresco visual en Angular. En algunas operaciones, la API respondía correctamente, pero la pantalla no actualizaba el estado hasta que el usuario hacía clic en algún campo. Para resolverlo, se utilizó `ChangeDetectorRef` en las vistas donde era necesario forzar la actualización de la interfaz tras respuestas HTTP.

Además, se ha mejorado el tratamiento de errores en la vista de creación, de forma que los errores de la API se muestran en pantalla y no solo en consola.

---

## Avance 21 - Tratamiento de campos opcionales y valores no disponibles

Se ha revisado el tratamiento de los campos que pueden no estar disponibles en la fuente de datos.

Los campos `emissionsIntensity` y `annualVariation` se consideran opcionales y pueden tomar el valor `null`.

En los formularios de creación y edición se permite dejar estos campos vacíos. Cuando el usuario los deja sin valor, Angular los transforma en `null` antes de enviar la petición al backend.

En la tabla de resultados, los valores `null` se muestran como `N/A`.

---

# Decisiones técnicas tomadas

## Uso de Node.js y Express

Se ha decidido utilizar Node.js con Express para implementar el backend REST.

## Uso de MongoDB Atlas

Se ha decidido utilizar MongoDB Atlas como base de datos en la nube.

## Separación entre backend y frontend

El proyecto se ha estructurado separando backend y frontend en carpetas independientes.

## Uso del campo `location`

Se mantiene el campo `location` tal y como aparece en la fuente de información.

Para facilitar la búsqueda, el backend implementa un filtro flexible por localización.

## Uso de Angular Router

Se ha incorporado Angular Router para separar vistas principales:

| Ruta | Descripción |
|---|---|
| `/` | Vista principal de listado, filtros, paginación y acciones |
| `/records/new` | Vista de creación de registros |
| `/records/:id/edit` | Vista de edición de registros |

---

# Próximos pasos

1. Completar y documentar las pruebas de todas las operaciones CRUD.
2. Preparar documentación de API con ejemplos de operaciones y estados devueltos.
3. Preparar colección de pruebas de Postman o Insomnia exportada.
4. Añadir visualizaciones con Highcharts o Google Charts.
5. Integrar una API externa de datos energéticos.
6. Enlazar la documentación y las visualizaciones desde la propia aplicación.
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
| Pendiente | Mejoras de frontend, paginación y rutas | Pendiente |
