# Guía de desarrollo

Esta guía describe el estado técnico de BetSphere durante la Fase 2. La aplicación completa definida en la documentación funcional todavía no es funcional: la versión actual permite ejecutar la infraestructura base y consultar un conjunto mínimo de datos de ejemplo de la entidad principal, persistidos en la base de datos. Los comandos se ejecutan desde la raíz del repositorio salvo que se indique lo contrario.

## Índice

- [Introducción](#introducción)
- [Tecnologías](#tecnologías)
- [Herramientas](#herramientas)
- [Arquitectura](#arquitectura)
- [Control de calidad](#control-de-calidad)
- [Proceso de desarrollo](#proceso-de-desarrollo)
- [Ejecución y edición del código](#ejecución-y-edición-del-código)

---

## Introducción

BetSphere se desarrolla como una aplicación web **SPA (Single Page Application)**. En este modelo, el navegador web carga el cliente de React una única vez y actualiza dinámicamente las vistas mediante el enrutador sin necesidad de solicitar una página HTML nueva al servidor en cada navegación. El cliente solicita y envía datos a través de peticiones HTTP a una API REST desarrollada en Spring Boot. El servidor gestiona la lógica de negocio y persiste la información de dominio en una base de datos MySQL.

| Aspecto | Estado de Fase 2 |
| --- | --- |
| **Tipo** | Aplicación Web SPA (cliente) y API REST (servidor). |
| **Tecnologías** | React, TypeScript, React Router y Vite; Java y Spring Boot; MySQL. |
| **Herramientas** | Entornos IDE (Visual Studio Code / IntelliJ), Git, GitHub, Node.js, Docker, OpenAPI y Postman. |
| **Control de calidad** | JUnit, Mockito, Testcontainers, Selenium, Vitest y flujos automáticos en GitHub Actions. |
| **Despliegue** | Entorno local de desarrollo con MySQL y cliente/servidor ejecutándose como procesos locales independientes. |
| **Proceso** | Iterativo e incremental basado en Programación Extrema (XP) y Kanban, ramas de funcionalidad cortas y controles obligatorios de CI/CD para la integración. |

## Tecnologías

*   **[Java](https://dev.java/) y [Spring Boot](https://spring.io/projects/spring-boot/):** Conforman el núcleo del backend, implementando la API REST, la seguridad, la capa de servicios de dominio y el acceso a datos mediante el patrón Repositorio.
*   **[MySQL](https://www.mysql.com/):** Sistema de gestión de bases de datos relacional empleado para la persistencia del modelo de datos de la plataforma.
*   **[React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) y [React Router](https://reactrouter.com/):** Forman el cliente SPA. React Router gestiona la navegación interna de la aplicación, mientras que TypeScript garantiza el tipado estricto para evitar errores en tiempo de compilación.
*   **[Vite](https://vitejs.dev/):** Herramienta de construcción (build tool) y servidor de desarrollo local para el frontend, que proporciona un arranque ultra rápido y Hot Module Replacement (HMR).

## Herramientas

*   **[Git](https://git-scm.com/) y [GitHub](https://github.com/):** Gestionan el control de versiones del código, el seguimiento de tareas mediante Issues y tableros Project, y la revisión de código a través de Pull Requests.
*   **[Node.js](https://nodejs.org/) y npm:** Entorno de ejecución y gestor de paquetes necesarios para instalar las dependencias del frontend e iniciar las herramientas de desarrollo de Vite.
*   **[Docker](https://www.docker.com/):** Proporciona el motor local necesario para levantar instancias efímeras de bases de datos durante las pruebas de integración a través de Testcontainers.
*   **[Postman](https://www.postman.com/):** Cliente HTTP empleado para realizar consultas manuales y verificar los endpoints de la API REST del servidor de forma aislada.

## Arquitectura

```mermaid
flowchart TB
    browser["Navegador Web<br/>SPA (React Router)"]
    postman["Postman<br/>Peticiones a la API"]
    vite["Vite<br/>Servidor Frontend :5173"]

    subgraph backend["Servidor · Spring Boot :8080"]
        direction TB
        controller["Controlador REST<br/>/api/v1/..."]
        service["Servicio de Negocio"]
        repository["Repositorio de Datos"]
        controller --> service --> repository
    end

    database[("MySQL :3306<br/>Base de datos local")]

    browser -->|"HTTP :5173<br/>Carga UI y consulta /api"| vite
    vite -->|"HTTP :8080<br/>Proxy de peticiones /api"| controller
    postman -.->|"HTTP GET/POST :8080"| controller
    repository -->|"JDBC / Protocolo MySQL<br/>TCP :3306"| database

    classDef user fill:#e2e8f0,stroke:#475569,color:#0f172a,stroke-width:2px
    classDef client fill:#dbeafe,stroke:#2563eb,color:#172554,stroke-width:2px
    classDef server fill:#ede9fe,stroke:#7c3aed,color:#2e1065,stroke-width:2px
    classDef data fill:#dcfce7,stroke:#16a34a,color:#14532d,stroke-width:2px
    class browser,postman user
    class vite client
    class controller,service,repository server
    class database data
```

En el entorno de desarrollo, la arquitectura se divide en **tres procesos totalmente independientes**: Vite (Frontend), Spring Boot (Backend) y MySQL (Base de datos). El navegador interactúa con la SPA servida por Vite en el puerto `5173`. Para solucionar problemas de CORS en desarrollo, Vite actúa como proxy, reenviando todas las llamadas al prefijo `/api` hacia el servidor backend que escucha en el puerto `8080`. El servidor, a su vez, se comunica mediante el driver JDBC con el motor de MySQL expuesto en el puerto `3306`.

**Documentación de la API (OpenAPI):**
La especificación técnica del contrato de la API REST se ha documentado siguiendo el estándar OpenAPI. La documentación HTML generada estáticamente es accesible a través del siguiente enlace, servida mediante RawGitHack:
**[Documentación API REST BetSphere](https://raw.githack.com/codeurjc-students/2026-BetSphere/main/docs/api/api-docs.html)** 

## Control de calidad

Para asegurar la robustez de las funcionalidades desarrolladas desde la Fase 2, se han implementado diversas capas de pruebas automáticas:

| Nivel de prueba | Herramientas | Comportamiento verificado |
| --- | --- | --- |
| **Unitarias (Servidor)** | JUnit, Mockito | Lógica de los servicios, doblando (mocking) el acceso al repositorio de base de datos. |
| **Integración (Servidor)** | Spring Boot Test, Testcontainers | Integración real de los servicios y repositorios contra una instancia efímera de MySQL levantada en Docker. |
| **Sistema / API (Servidor)** | REST Assured | Verificación de las respuestas HTTP y el contenido JSON devuelto por los endpoints. |
| **Unitarias (Cliente)** | Vitest | Renderizado de componentes aislados y uso de DOM virtual para simular la interfaz. |
| **Integración (Cliente-Servidor)** | Vitest, Backend real | El frontend obtiene el catálogo real desde la API REST y lo pinta correctamente. |
| **Sistema E2E UI** | Selenium, JUnit | Navegación automatizada desde un entorno de prueba simulando a un usuario real que accede a los datos. |

**Métricas y automatización:**
Actualmente, las herramientas de cobertura (JaCoCo para Java y el coverage de Vitest) monitorizan el código escrito. 
La cobertura actual se sitúa en un **75% en el servidor** y un **76% en el cliente**. 

![Captura del workflow de Integración Continua superado en GitHub Actions](./images/ci-success.png)
*Captura de los flujos de Integración Continua obligatorios en GitHub Actions*

## Proceso de desarrollo

El ciclo de vida del proyecto sigue un enfoque **iterativo e incremental** inspirado en los principios del manifiesto ágil, apoyándose en la gestión visual mediante **Kanban** y buenas prácticas de **Programación Extrema (XP)**. No se aplica el marco de trabajo Scrum.

*   **Gestión de tareas:** Se emplean GitHub Issues para la definición del trabajo y un tablero Kanban (GitHub Projects) para visualizar el flujo (Todo, In Progress, Review, Done).
*   **Git y ramas:** El flujo de trabajo exige la creación de ramas de funcionalidad cortas. La rama `main` actúa como la única fuente de verdad y se actualiza exclusivamente a través de Pull Requests.
*   **Integración Continua (CI):** El repositorio cuenta con GitHub Actions. Existe un control básico que se lanza automáticamente con cada *push* a una rama, ejecutando la compilación y los tests unitarios. Adicionalmente, la rama `main` se encuentra protegida: requiere que un workflow de **Full CI** (que levanta toda la infraestructura y ejecuta los tests E2E y Testcontainers) pase satisfactoriamente antes de permitir el *merge*.

## Ejecución y edición del código

### Clonar el repositorio
Se requiere tener instalados Git, Docker (en ejecución para los tests), Java, Node.js y npm.
```bash
git clone https://github.com/codeurjc-students/2026-BetSphere.git
cd 2026-BetSphere
```

### Ejecución de los procesos locales

**1. Base de Datos (MySQL)**
Ejecuta el script proporcionado en la raíz para levantar la instancia local:
```bash
./start_db.sh
```

**2. Backend (Spring Boot)**
En una nueva terminal, arranca el servidor web.
```bash
cd backend
./mvnw spring-boot:run
```
*(El servidor expondrá la API en `http://localhost:8080`)*

**3. Frontend (React/Vite)**
En una tercera terminal, instala las dependencias y lanza el entorno de desarrollo.
```bash
cd frontend
npm ci
npm run dev
```
*(Accede a `http://localhost:5173` desde el navegador para visualizar la aplicación)*

### Pruebas manuales con Postman
En la carpeta `docs/api/` se proporciona la colección exportada de Postman. Imprórtala en la aplicación para poder lanzar las peticiones preconfiguradas directamente contra el backend en el puerto 8080 y verificar la recuperación de los datos de ejemplo.

### Ejecución de pruebas automáticas
Para lanzar la suite de tests completos que exige la Integración Continua, puedes hacerlo de forma manual en local:

*   **Backend (Unitarias, Integración y E2E API):** 
    ```bash
    cd backend
    ./mvnw verify
    ```
*   **Frontend (Unitarias e Integración):**
    ```bash
    cd frontend
    npm run test
    ```

### Entrega continua

Cada push a `main` ejecuta `continuous-delivery.yml`, que llama al workflow
reutilizable `publish-artifacts.yml` con el SHA del cambio y el tag `dev`.
Este publica la imagen `huugoocm/betsphere:dev` y el artefacto OCI
`huugoocm/betsphere-compose:dev`. El resumen de Actions registra el SHA,
el digest de la imagen y las referencias publicadas. Las publicaciones de
desarrollo se ejecutan de una en una mediante el grupo `publish-dev`.

En GitHub, configura los secretos de Actions `DOCKERHUB_USERNAME` y
`DOCKERHUB_TOKEN`. La cuenta debe tener permiso de escritura en los repositorios
Docker Hub `huugoocm/betsphere` y `huugoocm/betsphere-compose`.

Para preparar esa configuración, sigue estos pasos

1. Inicia sesión en Docker Hub con la cuenta `huugoocm` y crea los repositorios
   `betsphere` y `betsphere-compose` si todavía no existen.
2. Crea un token de acceso personal de Docker con permisos de lectura y escritura
   en repositorios. Ese token permite que Actions publique usando tu cuenta.
3. En el repositorio GitHub, abre Settings → Secrets and variables → Actions →
   New repository secret. Guarda `DOCKERHUB_USERNAME` con el usuario `huugoocm`
   y `DOCKERHUB_TOKEN` con el token creado en Docker.
4. Integra el workflow en `main` mediante una PR y revisa la ejecución
   Continuous Delivery que provoca el merge.

Las instrucciones oficiales detallan la gestión del token y de los secretos.
[Docker](https://docs.docker.com/security/access-tokens/),
[GitHub Actions](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets).

El workflow genera una copia temporal de `docker/docker-compose.yml` con el tag
de la publicación. Las variables de configuración se conservan para el despliegue.
Las builds manuales y las releases utilizan el mismo publicador. La preparación
de versiones se realiza con Prepare Version.

Para construir la imagen desde la raíz del repositorio, ejecuta

```bash
docker build -f docker/dockerfile -t betsphere:local .
```

El frontend se compila como SPA y Spring sirve sus archivos estáticos y las
rutas de navegación. Las rutas privadas de la API mantienen sus controles de acceso.

Para desplegar los artefactos publicados, prepara un archivo `.env` local con
`DB_NAME`, `DB_USER`, `DB_PASSWORD`, `KEYSTORE_PASSWORD` y `KEYSTORE_SECRET`.
Para el MySQL incluido, usa `DB_USER=root`, ya que Compose configura esa cuenta.
Los valores HTTPS deben corresponder al almacén `backend/src/main/resources/keystore.jks`.
También puedes definir `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`, `S3_REGION` y
`S3_BUCKET`.

Con Docker Compose 5.6.1, ejecuta desde la carpeta del archivo `.env`

```bash
docker compose --env-file .env -f oci://docker.io/huugoocm/betsphere-compose:dev up -d
```

Abre `https://localhost/` y comprueba también el acceso directo a `/matches` y
`/login`. El certificado del almacén local puede requerir que el navegador confirme
su confianza. Los datos de MySQL y del almacenamiento de imágenes se guardan en
volúmenes Docker.

### Publicación de una build manual

Una vez integrado `manual-build.yml` en `main`, abre Actions → Manual Build →
Run workflow. En el selector de la definición del workflow, utiliza `main`.
Los campos del formulario eligen el código que se va a publicar

- `branch` indica la rama de origen, por ejemplo `main` o `feature/chat`.
- `commit` permite indicar un SHA completo o abreviado de entre 7 y 40 caracteres.
  Si se deja vacío, se utiliza el último commit de la rama seleccionada al hacer
  el checkout. El commit indicado debe formar parte del historial de esa rama.

El workflow resuelve primero el SHA completo y después llama al publicador con
ese commit. El resumen de la ejecución registra la rama, el SHA y el tag generado.
Una build de `feature/chat` tendrá un tag con este formato

```text
feature-chat-20261121-203000-a1b2c3d4e5f6
```

La fecha y la hora se calculan en UTC. El nombre de rama se convierte a minúsculas,
sus caracteres incompatibles con Docker se sustituyen por guiones y se limita a
80 caracteres. El SHA abreviado tiene 12 caracteres.

Se publican `huugoocm/betsphere:<tag>` y `huugoocm/betsphere-compose:<tag>`.
El Compose apunta a la imagen con ese mismo tag. Los tags `dev` y `latest`
se conservan durante las publicaciones manuales.

Para ejecutar una build publicada, sustituye `<tag>` por el valor que muestra
Actions y utiliza tu archivo `.env` de despliegue

```bash
docker compose --env-file .env -f oci://docker.io/huugoocm/betsphere-compose:<tag> up -d
```

Una rama inexistente, un SHA inválido o un commit ajeno al historial de la rama
detienen la preparación antes de autenticar y publicar en Docker Hub. Una build
de un commit anterior utiliza el Dockerfile y el Compose de ese commit, que deben
ser compatibles con el empaquetado de la aplicación en esa versión.

### Preparación de versiones

Actions → Prepare Version → Run workflow permite preparar los cambios de versión
mediante una PR a `main`. Selecciona `main` en el selector del workflow y completa
`operation` (`release` o `development`) y `version` (dos o tres componentes
numéricos, sin `v` ni `SNAPSHOT`).

| Operación | Entrada | Backend | Frontend y lockfile | Tag de imagen en Compose |
| --- | --- | --- | --- | --- |
| `release` | `0.1` | `0.1.0` | `0.1.0` | `0.1` |
| `release` | `0.0.1` | `0.0.1` | `0.0.1` | `0.0.1` |
| `development` | `0.2` | `0.2.0-SNAPSHOT` | `0.2.0` | `0.2` |

El script actualiza la versión propia del backend, la del cliente, las dos
referencias del paquete raíz en `package-lock.json` y la imagen de la aplicación
en `docker/docker-compose.yml`. Conserva las versiones de las dependencias y de
los otros servicios. Valida todos los archivos antes de escribir los cambios.

Cada combinación de operación y versión utiliza una rama estable, por ejemplo
`chore/prepare-release-0.1.0`. Repetirla actualiza la PR existente; las entradas
`0.1` y `0.1.0` producen los mismos cambios y la misma rama. Si `main` ya tiene
esas versiones, no se abre otra PR. El resumen de Actions muestra el resultado.

Antes de usarlo, habilita Settings → Actions → General → Workflow permissions →
**Allow GitHub Actions to create and approve pull requests**. Si la organización
restringe esta opción, debe habilitarla un administrador. El workflow solicita
permisos de escritura sobre contenido y PRs y utiliza el `GITHUB_TOKEN` que GitHub
proporciona automáticamente; no utiliza el token de Docker Hub.

Con el token predeterminado, GitHub puede solicitar **Approve workflows to run**
en la PR generada. Aprueba las comprobaciones y espera a que Full CI termine antes
del merge. Para iniciar los controles automáticamente, se puede configurar el
secreto opcional `VERSION_BUMP_TOKEN` con un token de GitHub con permisos de
escritura en Contents y Pull requests de este repositorio. Consulta las
[reglas de activación de GitHub Actions](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)
y los [permisos del creador de PRs](https://github.com/peter-evans/create-pull-request#workflow-permissions).

El orden de trabajo es preparar y fusionar la PR `release`, crear la release de
GitHub desde ese commit de `main`, y después preparar y fusionar la PR
`development`. Este workflow también admite `workflow_call` con los mismos
campos, para que el publicador de releases del #77 pueda solicitar la siguiente
versión después de publicar correctamente. El llamador debe conceder los mismos
permisos y pasar `VERSION_BUMP_TOKEN` si lo utiliza. Preparar versiones por sí solo
no crea tags, releases ni publicaciones en Docker Hub.

Las pruebas de esta operación se ejecutan en Full CI y pueden lanzarse localmente
con `node --test .github/scripts/set-versions.test.mjs` desde la raíz.

### Publicación de una release de GitHub

El workflow **GitHub Release** se ejecuta únicamente al publicar una release
(`release: published`). Integrar su PR en `main` deja preparada la automatización;
no crea tags ni releases. Guardar un borrador tampoco publica artefactos. El evento
`published` incluye las releases marcadas como prerelease: usa una versión numérica
como `0.0.1` para un ensayo y ten en cuenta que también actualizará `latest`.
Consulta los [eventos de GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#release).

Cuando la fase esté terminada y se decida publicar:

1. Ejecuta Prepare Version con `operation=release` y la versión elegida.
   Revisa, comprueba la CI y fusiona su PR a `main`.
2. En GitHub → Releases → Draft a new release, crea el tag sobre el commit de
   `main` que contiene esas versiones. Para la entrega, el tag es `0.1`; para un
   ensayo previo se puede utilizar `0.0.1`. Publica la release cuando corresponda.
3. Revisa la ejecución GitHub Release y su resumen de publicación. Después del
   éxito se prepara mediante el #78 una PR con la siguiente versión de desarrollo;
   espera a que pasen sus controles antes de fusionarla.

La validación resuelve el tag a un SHA y comprueba que coincide con el commit del
evento y pertenece al historial de `main`. Lee las versiones desde ese commit,
incluido `package-lock.json`, y rechaza valores inconsistentes o `SNAPSHOT`.
El publicador recibe el SHA exacto, por lo que los cambios posteriores en `main`
no entran en la imagen de esa release.

| Tag de GitHub | Backend y frontend en el tag | Imagen en el Compose del tag | Tags publicados en ambos repositorios Docker Hub |
| --- | --- | --- | --- |
| `0.0.1` | `0.0.1` | `0.0.1` | `0.0.1`, `latest` |
| `0.1` o `0.1.0` | `0.1.0` | `0.1` | `0.1`, `0.1.0`, `latest` |

Los aliases de la imagen comparten una única construcción y digest. Los aliases
del artefacto OCI contienen el mismo Compose, que referencia la imagen versionada
y conserva las variables del despliegue. El publicador común admite aliases
opcionales; Continuous Delivery y Manual Build siguen pasando un único tag.
La publicación del Compose utiliza el
[soporte OCI de Docker Compose](https://docs.docker.com/compose/how-tos/oci-artifact/).

Después de publicar `0.1` se propone `0.2.0-SNAPSHOT` en el backend, `0.2.0` en
el frontend y `0.2` en Compose. Las releases con patch distinto de cero avanzan
ese patch: el ensayo `0.0.1` propone `0.0.2-SNAPSHOT` / `0.0.2`. Se pueden ajustar
estas versiones en una PR posterior cuando cambie el objetivo de desarrollo.
Si al validar la release `main` ya está en esa siguiente versión o una superior,
se omite la preparación para evitar retroceder. Repetir la publicación reutiliza
la misma rama de preparación mientras su PR siga abierta. La preparación no se
ejecuta si falla la validación o la publicación.

Se utilizan los secretos Docker Hub ya configurados y los permisos de creación
de PR descritos en el apartado anterior. Si falla únicamente la preparación de
desarrollo, los artefactos publicados permanecen disponibles: corrige los permisos
y vuelve a ejecutar los jobs fallidos, o utiliza Prepare Version manualmente.

Para verificar el workflow antes de publicar, ejecuta
`node --test .github/scripts/*.test.mjs`. Las pruebas crean repositorios locales
temporales para simular tags, cambios posteriores en `main` y metadatos inválidos;
no publican releases ni se conectan a Docker Hub. La comprobación completa de
publicación y despliegue queda pendiente de la release de ensayo autorizada.
