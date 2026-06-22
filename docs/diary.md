# DGSIN-2526-10

## Equipo

[María Jesús Cadenas Sánchez](https://github.com/marcadsan2)

## Descripción del proyecto

El proyecto consistirá en desarrollar un sistema de información basado en microservicios para analizar la evolución de las emisiones de CO₂ por país y año.

La aplicación permitirá consultar, visualizar, crear, editar y eliminar datos sobre emisiones contaminantes procedentes de una fuente de información no ofrecida directamente mediante una API pública. Estos datos incluirán emisiones totales, emisiones per cápita, intensidad de emisiones y variación anual.

Además, en fases posteriores del proyecto, el sistema se integrará con una API externa de datos energéticos para complementar la información disponible y permitir análisis comparativos relacionados con la transición energética.

El objetivo principal será estudiar la evolución de las emisiones de CO₂ en distintos países y periodos, ofreciendo una herramienta que permita gestionar los datos y visualizar tendencias medioambientales de forma sencilla.

## Repositorio

[mii-dgsin/DGSIN-2526-10](https://github.com/mii-dgsin/DGSIN-2526-10)

## URL

Pendiente.

## APIs

Pendiente.

---

# María Jesús Cadenas Sánchez - Fuente de datos

## Datos

`carbon-emission-records`

## Fuente de información

https://datosmacro.expansion.com/energia-y-medio-ambiente/emisiones-co2

## Descripción de la fuente

La fuente de información seleccionada contiene datos de emisiones de CO₂ por país y año. Se trata de una página web con información estructurada en tablas HTML, por lo que los datos no se obtienen directamente desde una API pública propia de la fuente.

Esta fuente permite analizar la evolución de las emisiones contaminantes a nivel internacional, incluyendo información geográfica, información temporal y distintos indicadores relacionados con el volumen total de emisiones, las emisiones por habitante, la intensidad de emisiones y la variación anual.

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
| Spain | 2022 | 235.471 | 0.11 | 5.07 | -0.84 |

## Campos de la fuente

| Campo | Descripción |
|---|---|
| `location` | País al que pertenecen los datos |
| `period` | Año del registro |
| `total-emissions-mt` | Emisiones totales de CO₂ en megatoneladas |
| `emissions-intensity` | Intensidad de emisiones |
| `emissions-per-capita` | Emisiones de CO₂ por habitante |
| `annual-variation` | Variación anual de las emisiones |

## Compatibilidad futura con otras fuentes

Para facilitar la integración posterior con una API externa de datos energéticos, se utilizarán las siguientes dimensiones comunes:

| Dimensión | Campo usado |
|---|---|
| Información geográfica | `location` |
| Información temporal | `period` |

La información geográfica se representará a nivel de país y la información temporal se representará a nivel de año. Esto permitirá comparar posteriormente los datos de emisiones de CO₂ con otros datos energéticos externos.

---

# Avances del proyecto

## Avance 1 - Definición inicial del proyecto

Se ha definido el objetivo principal del proyecto: construir un sistema de información en la nube para gestionar y analizar datos de emisiones de CO₂ por país y año.

También se ha decidido que la fuente principal de datos será `carbon-emission-records`, basada en información obtenida desde la página de Datosmacro sobre emisiones de CO₂.

Se ha decidido que, en fases posteriores, el sistema podrá integrarse con una API externa de datos energéticos para realizar comparaciones relacionadas con la transición energética.

---

## Avance 2 - Creación del repositorio y estructura del proyecto

Se ha creado el repositorio del proyecto dentro de la organización de la asignatura:

[mii-dgsin/DGSIN-2526-10](https://github.com/mii-dgsin/DGSIN-2526-10)

Se ha reorganizado la estructura inicial del proyecto para separar claramente el backend y la documentación, dejando preparada la incorporación posterior del frontend.

La estructura actual del proyecto es la siguiente:

```txt
DGSIN-2526-10/
├── backend/
│   ├── data/
│   │   └── carbonEmissionRecords.json
│   ├── node_modules/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── carbonEmissionRecord.controller.js
│   │   ├── models/
│   │   │   └── carbonEmissionRecord.model.js
│   │   ├── routes/
│   │   │   └── carbonEmissionRecord.routes.js
│   │   ├── scripts/
│   │   │   └── loadCarbonEmissionRecords.js
│   │   └── app.js
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   └── package.json
├── docs/
│   ├── postman/
│   └── diary.md
└── README.md
```

La estructura anterior evita mantener una carpeta duplicada de `backend/backend` y deja el proyecto más claro para el desarrollo, la documentación y el futuro despliegue.

Como mejora pendiente, se valorará mover o duplicar el archivo `.gitignore` a la raíz del repositorio para aplicar reglas generales a todo el proyecto cuando se incorpore el frontend.

---

## Avance 3 - Creación del backend inicial

Se ha creado el backend inicial del proyecto usando Node.js y Express dentro de la carpeta `backend/`.

Se han instalado las dependencias principales del backend:

```txt
express
cors
dotenv
mongoose
nodemon
```

Se ha creado un primer endpoint de comprobación de estado:

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/v1/health` | Comprueba que la API está funcionando correctamente |

También se ha creado una ruta raíz para comprobar que el servidor responde correctamente:

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/` | Devuelve un mensaje indicando que la API está en ejecución |

---

## Avance 4 - Configuración de MongoDB Atlas

Se ha configurado la conexión del backend con MongoDB.

Inicialmente se probó una conexión local, pero se decidió utilizar MongoDB Atlas porque será más adecuado para el despliegue posterior en la nube.

Se ha creado un archivo de configuración para la conexión a la base de datos:

```txt
backend/src/config/db.js
```

También se ha añadido la variable de entorno `MONGODB_URI` en el archivo `.env`.

Durante la configuración se detectó un error de resolución DNS en la cadena de conexión de MongoDB Atlas:

```txt
querySrv ENOTFOUND _mongodb._tcp.cluster.g5cdqlu.mongodb.net
```

El problema estaba relacionado con una cadena de conexión incorrecta. Se corrigió la URI de MongoDB Atlas y posteriormente el backend arrancó correctamente conectando con la base de datos.

---

## Avance 5 - Creación del modelo de datos

Se ha creado el modelo de datos principal del proyecto:

```txt
CarbonEmissionRecord
```

El archivo del modelo se encuentra en:

```txt
backend/src/models/carbonEmissionRecord.model.js
```

El modelo representa los registros de emisiones de CO₂ y contiene los siguientes campos:

| Campo en MongoDB | Campo del diario | Tipo |
|---|---|---|
| `location` | `location` | String |
| `period` | `period` | Number |
| `totalEmissionsMt` | `total-emissions-mt` | Number |
| `emissionsIntensity` | `emissions-intensity` | Number |
| `emissionsPerCapita` | `emissions-per-capita` | Number |
| `annualVariation` | `annual-variation` | Number |

Se ha añadido una restricción para evitar registros duplicados con la misma combinación de país y año.

---

## Avance 6 - Creación del recurso REST

Se ha implementado el primer recurso REST de la API:

```txt
/api/v1/carbon-emission-records
```

Para ello se han creado las carpetas `models`, `controllers` y `routes`.

El recurso permite realizar operaciones CRUD sobre los registros de emisiones de CO₂.

## Endpoints implementados

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/v1/health` | Comprueba que la API está funcionando |
| GET | `/api/v1/carbon-emission-records` | Obtiene todos los registros de emisiones de CO₂ |
| GET | `/api/v1/carbon-emission-records?location=Spain` | Filtra los registros por país |
| GET | `/api/v1/carbon-emission-records?period=2022` | Filtra los registros por año |
| GET | `/api/v1/carbon-emission-records?location=Spain&period=2022` | Filtra los registros por país y año |
| GET | `/api/v1/carbon-emission-records/:id` | Obtiene un registro concreto por identificador |
| POST | `/api/v1/carbon-emission-records` | Crea un nuevo registro de emisiones |
| PUT | `/api/v1/carbon-emission-records/:id` | Actualiza un registro existente |
| DELETE | `/api/v1/carbon-emission-records/:id` | Elimina un registro existente |

---

## Avance 7 - Carga inicial de datos

Se ha creado un archivo JSON con datos iniciales de emisiones de CO₂:

```txt
backend/data/carbonEmissionRecords.json
```

El primer dato cargado corresponde a España en el año 2022:

```json
{
  "location": "Spain",
  "period": 2022,
  "totalEmissionsMt": 235.471,
  "emissionsIntensity": 0.11,
  "emissionsPerCapita": 5.07,
  "annualVariation": -0.84
}
```

También se ha creado un script para cargar los datos iniciales en MongoDB:

```txt
backend/src/scripts/loadCarbonEmissionRecords.js
```

El script se ejecuta mediante el siguiente comando:

```bash
npm run load:carbon
```

La carga de datos se ha probado correctamente y el registro inicial se ha insertado en la base de datos.

---

## Avance 8 - Pruebas iniciales de la API

Se han comenzado a realizar pruebas de la API usando Insomnia.

Se han probado los endpoints principales para comprobar que el backend responde correctamente y que los datos se recuperan desde MongoDB.

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

Está pendiente exportar o documentar las pruebas de API para incluirlas en la entrega final del proyecto.

---

## Avance 9 - Organización de documentación

Se ha creado la carpeta `docs/` para guardar la documentación del proyecto.

Actualmente contiene el diario de desarrollo y una carpeta para almacenar documentación o colección de pruebas de la API:

```txt
docs/
├── diary.md
└── postman/
```

Aunque durante el desarrollo se está utilizando Insomnia, se mantiene la carpeta `postman/` para poder incluir posteriormente documentación compatible con Postman si fuera necesario para la entrega.

---

## Avance 10 - Validación y control de errores

Se ha añadido una capa de validación para el recurso `carbon-emission-records`.

La validación comprueba que los datos recibidos en las operaciones de creación y actualización contienen los campos obligatorios y que los tipos de datos son correctos.

También se ha añadido un middleware para gestionar rutas no encontradas, devolviendo una respuesta JSON con código HTTP 404 cuando se solicita un endpoint inexistente.

Con estos cambios, la API mejora su robustez y ofrece respuestas más claras ante peticiones incorrectas.

---

# Decisiones técnicas tomadas

## Uso de Node.js y Express

Se ha decidido utilizar Node.js con Express para implementar el backend REST de la aplicación.

Express permite crear de forma sencilla los endpoints necesarios para gestionar los recursos del sistema.

## Uso de MongoDB Atlas

Se ha decidido utilizar MongoDB Atlas como base de datos en la nube.

Esta decisión facilita el despliegue posterior de la aplicación, ya que el backend no dependerá de una base de datos instalada localmente en el ordenador de desarrollo.

## Separación entre backend y frontend

El proyecto se ha estructurado separando el backend en una carpeta propia. Más adelante se añadirá una carpeta `frontend/` para implementar la aplicación Angular.

La estructura prevista será:

```txt
DGSIN-2526-10/
├── backend/
├── frontend/
├── docs/
└── README.md
```

## Uso de Insomnia para pruebas

Se está utilizando Insomnia para probar los endpoints de la API durante el desarrollo.

Más adelante se valorará si es necesario crear o exportar una colección compatible con Postman, en función de los requisitos finales de la asignatura.

---

# Próximos pasos

Los próximos pasos del proyecto serán:

1. Completar las pruebas de todos los endpoints CRUD.
2. Añadir más datos reales de emisiones de CO₂.
3. Mejorar la validación de datos de entrada.
4. Gestionar mejor los errores de la API.
5. Preparar documentación de la API.
6. Añadir configuración para despliegue en Google App Engine.
7. Crear el frontend con Angular.
8. Integrar una API externa de datos energéticos.
9. Añadir visualizaciones y comparativas.
10. Actualizar el diario con cada avance realizado.

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
