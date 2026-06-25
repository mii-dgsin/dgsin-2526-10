# DGSIN-2526-10

## Equipo

[María Jesús Cadenas Sánchez](https://github.com/mjcadenas)

## Descripción del proyecto

El proyecto consiste en desarrollar un sistema de información en la nube para analizar la evolución de las emisiones de CO₂ por localización y año.

La aplicación permite consultar, filtrar, crear, editar y eliminar registros de emisiones contaminantes procedentes de una fuente de información que no se consume directamente mediante una API pública propia. Los datos incluyen emisiones totales, emisiones por habitante, intensidad de emisiones y variación anual.

Además, el proyecto se integra con la API externa de Ember Energy para complementar la información de emisiones con datos de generación eléctrica anual, utilizando un proxy propio en el backend para no exponer la API key en el frontend.

## Repositorio

[mii-dgsin/dgsin-2526-10](https://github.com/mii-dgsin/dgsin-2526-10)

## URL

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com
```

## Documentación

```txt
docs/api.md
docs/postman/DGSIN-2526-10.postman_collection.json
```

---

# Fuente de datos

## Datos

`carbon-emission-records`

## Fuente de información

```txt
https://datosmacro.expansion.com/energia-y-medio-ambiente/emisiones-co2
```

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

---

# Avances del proyecto

## Avance 1 - Definición inicial del proyecto

Se ha definido el objetivo principal del proyecto: construir un sistema de información en la nube para gestionar y analizar datos de emisiones de CO₂ por localización y año.

También se ha decidido que la fuente principal de datos será `carbon-emission-records`, basada en información obtenida desde la página de Datosmacro sobre emisiones de CO₂.

---

## Avance 2 - Creación del repositorio y estructura del proyecto

Se ha creado el repositorio del proyecto dentro de la organización de la asignatura:

[mii-dgsin/dgsin-2526-10](https://github.com/mii-dgsin/dgsin-2526-10)

Se ha organizado el proyecto separando backend, frontend y documentación:

```txt
dgsin-2526-10/
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

Se ha creado el archivo `backend/src/config/db.js` y se ha configurado la variable `MONGODB_URI`.

---

## Avance 5 - Creación del modelo de datos

Se ha creado el modelo `CarbonEmissionRecord`.

El modelo contiene los campos `location`, `period`, `totalEmissionsMt`, `emissionsIntensity`, `emissionsPerCapita` y `annualVariation`.

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

Se han comenzado a realizar pruebas manuales de la API usando Insomnia.

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

También se han mejorado los mensajes de error devueltos por la API y el refresco visual de la interfaz.

---

## Avance 21 - Tratamiento de campos opcionales y valores no disponibles

Se ha revisado el tratamiento de los campos que pueden no estar disponibles en la fuente de datos.

Los campos `emissionsIntensity` y `annualVariation` se consideran opcionales y pueden tomar el valor `null`.

---

## Avance 22 - Integración externa con Ember Energy mediante proxy propio

Se ha añadido una integración externa con la API de Ember Energy.

El objetivo de esta integración es complementar los registros propios de emisiones de CO₂ con datos externos de generación eléctrica anual. Para ello se ha creado una ruta de integración en el backend que actúa como proxy entre el frontend Angular y la API externa de Ember.

La ruta creada es:

```txt
GET /api/v1/integrations/renewable-electricity
```

Esta ruta permite consultar datos usando parámetros como:

| Parámetro | Descripción |
|---|---|
| `location` | Localización o país a consultar |
| `fromPeriod` | Año inicial |
| `toPeriod` | Año final |

Ejemplo:

```txt
GET /api/v1/integrations/renewable-electricity?location=Spain&fromPeriod=2020&toPeriod=2023
```

La integración combina dos fuentes:

| Fuente | Tipo | Uso |
|---|---|---|
| `carbon-emission-records` | API propia | Registros de emisiones de CO₂ almacenados en MongoDB Atlas |
| Ember Energy API | API externa | Datos externos de generación eléctrica anual |

La llamada a Ember se realiza desde el backend y no directamente desde Angular. Esto evita exponer la API key en el frontend y permite cumplir mejor el requisito de integración mediante proxy propio.

La ruta se ha probado correctamente tras configurar la variable de entorno `EMBER_API_KEY`.

---

## Avance 23 - Vista Angular para la integración externa con Ember Energy

Se ha añadido una nueva vista en el frontend Angular para consultar la integración externa con Ember Energy.

La vista se encuentra disponible en la ruta:

```txt
/integrations/renewable-electricity
```

Desde esta pantalla se pueden introducir los parámetros `location`, `fromPeriod` y `toPeriod`. Angular llama al backend del proyecto, que actúa como proxy propio hacia la API externa de Ember Energy.

La vista muestra un resumen de la integración, incluyendo la localización consultada, la entidad utilizada por Ember, el rango temporal, el número de registros locales de emisiones de CO₂ y el número de registros externos obtenidos desde Ember.

También se muestran los registros locales de emisiones en una tabla y la respuesta externa de Ember en formato JSON para documentar la estructura real de los datos utilizados.

---

## Avance 24 - Visualizaciones de la integración externa con Highcharts

Se han añadido visualizaciones al frontend Angular utilizando Highcharts.

Las visualizaciones se han incorporado en la vista de integración externa con Ember Energy:

```txt
/integrations/renewable-electricity
```

Se han añadido tres gráficos principales:

| Gráfico | Fuente | Descripción |
|---|---|---|
| CO₂ emissions by year | API propia `carbon-emission-records` | Muestra la evolución de las emisiones totales de CO₂ por año |
| External Ember electricity data by year | API externa Ember Energy | Muestra datos anuales procedentes de la fuente externa integrada |
| CO₂ emissions vs Ember electricity data | API propia + API externa | Muestra una comparación visual entre ambas fuentes usando dos ejes Y |

El primer gráfico utiliza los registros de emisiones almacenados en MongoDB Atlas. El segundo gráfico utiliza la respuesta externa de Ember obtenida a través del proxy propio del backend.

El tercer gráfico combina ambas fuentes en una única visualización. Al tratarse de métricas con unidades diferentes, se utilizan dos ejes Y: uno para las emisiones de CO₂ y otro para los valores de generación eléctrica.

Con este avance, la aplicación ya incorpora widgets de visualización y no se limita a mostrar los datos en tablas.

---

## Avance 25 - Localizaciones dinámicas compatibles para la integración

Se ha mejorado la selección de localizaciones de la vista de integración externa.

El backend incorpora la ruta:

```txt
GET /api/v1/integrations/supported-locations
```

Esta ruta obtiene dinámicamente las entidades disponibles en Ember Energy y las cruza con las localizaciones existentes en la colección local `carbon-emission-records`.

Para evitar emparejamientos incorrectos, el cruce se realiza mediante coincidencia exacta normalizada y alias controlados para casos concretos en los que la fuente local agrupa varios territorios.

Ejemplos de alias controlados:

| Ember entity | Local CO₂ dataset location |
|---|---|
| Spain | Spain and Andorra |
| France | France and Monaco |
| Italy | Italy, San Marino and the Holy See |
| Switzerland | Switzerland and Liechtenstein |

En el frontend, la vista de integración utiliza un selector desplegable con las localizaciones compatibles devueltas por el backend. Esto evita que el usuario introduzca valores no soportados por la integración externa.

---

## Avance 26 - Documentación formal de la API

Se ha creado el documento:

```txt
docs/api.md
```

En este documento se describen los endpoints principales de la API propia `carbon-emission-records` y de la API de integración `integrations`.

La documentación incluye ejemplos de peticiones, respuestas correctas, errores esperados, códigos de estado y una explicación del uso del proxy propio para la integración externa.

---

## Avance 27 - Página de documentación en Angular

Se ha añadido una página de documentación dentro del frontend Angular.

La vista se encuentra disponible en:

```txt
/documentation
```

Esta página resume el objetivo del proyecto, la fuente de datos local, la integración externa con Ember Energy, las rutas principales de la aplicación y los endpoints principales de la API.

También incluye enlaces al repositorio de GitHub, a la API desplegada en Google App Engine y a los documentos del proyecto.

---

## Avance 28 - Despliegue del frontend, actualización de documentación y pruebas Postman

Se ha preparado el despliegue del frontend Angular junto con el backend de Express en Google App Engine.

Para ello, se ha generado la versión de producción del frontend Angular mediante el proceso de build y se ha integrado el resultado dentro del backend, de forma que Express pueda servir tanto la API REST como la aplicación web Angular desde la misma URL desplegada.

Con este cambio, la aplicación completa queda accesible desde:

https://dgsin-2526-10-mjcadenas.ew.r.appspot.com

Además de los endpoints de la API, también quedan disponibles las rutas principales del frontend:

```txt
/
 /records/new
 /records/:id/edit
 /integrations/renewable-electricity
 /documentation
```
También se ha actualizado la documentación del proyecto para reflejar el estado actual de la aplicación. Se han actualizado el README.md, el diario del proyecto y la documentación formal de la API en:

```txt
docs/api.md
```

La documentación recoge los endpoints principales de la API propia carbon-emission-records, los endpoints de integración con Ember Energy, ejemplos de peticiones y respuestas, errores esperados y códigos de estado.

Por último, se ha creado y ejecutado una colección Postman para validar el comportamiento de la API desplegada en producción.

El archivo de la colección se encuentra en:

```txt
docs/postman/DGSIN-2526-10.postman_collection.json
```
 
La colección está configurada para apuntar por defecto al backend desplegado en Google App Engine:

```txt
https://dgsin-2526-10-mjcadenas.ew.r.appspot.com
```

La colección incluye pruebas para:

- Comprobar el estado de la API.
- Obtener registros de emisiones.
- Filtrar registros por localización y rango de años.
- Obtener localizaciones disponibles.
- Crear un registro de prueba.
- Validar el error de duplicado.
- Obtener el registro creado por ID.
- Actualizar el registro creado.
- Eliminar el registro creado.
- Verificar que el registro eliminado ya no existe.
- Obtener localizaciones soportadas por la integración.
- Obtener datos integrados con Ember Energy.
- Validar error de localización no soportada.
- Validar error de ruta inexistente.

Las pruebas incluyen comprobaciones de códigos de estado y de estructura básica de las respuestas.

Como evidencia de ejecución final, se conserva una captura del Runner de Postman con el resultado de las pruebas ejecutadas contra producción:
```txt
docs/postman/postman-run-results.png
```

---

# Decisiones técnicas tomadas

## Uso de Node.js y Express

Se ha decidido utilizar Node.js con Express para implementar el backend REST.

## Uso de MongoDB Atlas

Se ha decidido utilizar MongoDB Atlas como base de datos en la nube.

## Separación entre backend y frontend

El proyecto se ha estructurado separando backend y frontend en carpetas independientes.

## Uso de Angular Router

Se ha incorporado Angular Router para separar vistas principales:

| Ruta | Descripción |
|---|---|
| `/` | Vista principal de listado, filtros, paginación y acciones |
| `/records/new` | Vista de creación de registros |
| `/records/:id/edit` | Vista de edición de registros |
| `/integrations/renewable-electricity` | Vista de integración externa con Ember Energy y visualizaciones |
| `/documentation` | Página de documentación del proyecto |

## Uso de proxy propio para integración externa

Se ha decidido que la integración con Ember Energy se realice desde el backend mediante un proxy propio. Esto permite ocultar la API key al frontend y mejora la seguridad de la integración.

## Localizaciones compatibles dinámicas

La vista de integración no utiliza una lista fija de países. El backend obtiene dinámicamente las entidades disponibles en Ember Energy y las cruza con las localizaciones presentes en la fuente propia.

---

# Próximos pasos

1. Revisar visualmente la aplicación para preparar la grabación del vídeo.
2. Enlazar el vídeo explicativo en la aplicación si se genera antes de la entrega.
3. Preparar la revisión final del README, diario y documentación antes de entregar.

---


# Registro de tiempos

Los tiempos de trabajo se han registrado en Toggl bajo el proyecto `dgsin-2526-10`.

El total registrado para el proyecto es de **63 h 30 min**. La distribución por semanas refleja una primera fase de preparación, análisis de requisitos y seguimiento de materiales de la asignatura, y una segunda fase centrada en el desarrollo, despliegue, integración, visualización y documentación final.

| Semana | Bloque de trabajo | Descripción | Tiempo |
|---|---|---|---:|
| 4-10 Mayo | Preparación inicial y análisis de la asignatura | Revisión de vídeos y materiales de la asignatura, análisis de la rúbrica, comprensión de requisitos, selección inicial de temática y definición preliminar del proyecto. | 9 h |
| 11-17 Mayo | Definición del proyecto y preparación técnica inicial | Revisión adicional de materiales, elección definitiva de la fuente de datos, definición del recurso `carbon-emission-records`, planificación de la arquitectura, creación de la estructura inicial del repositorio y primeras pruebas de backend. | 10 h |
| 22-28 Junio | Desarrollo principal y cierre del proyecto | Implementación del backend REST, modelo de datos, validaciones, carga inicial de datos, conexión con MongoDB Atlas, despliegue en Google App Engine, desarrollo del frontend Angular, vistas de listado, creación y edición, integración externa con Ember Energy mediante proxy propio, visualizaciones con Highcharts, documentación formal de API, colección Postman y página de documentación en Angular. | 44 h 30 min |

**Tiempo total registrado:** 63 h 30 min

**Media diaria en los días con actividad registrada:** 10 h 35 min aproximadamente.

