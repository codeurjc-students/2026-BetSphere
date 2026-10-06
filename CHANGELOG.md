# Historial de Cambios (CHANGELOG.md)

Todos los cambios notables realizados en el proyecto **BetSphere** serán documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [Unreleased]

### Planificado
* Inicio de la **Fase 3: Seguridad y Despliegue**.
* Implementación de autenticación y autorización con Spring Security y JWT.
* Despliegue en entorno de producción.

---

## [0.2.0-fase2] - 2026-10-06

### Añadido
* **Backend (Spring Boot):** Inicialización del proyecto y configuración de la persistencia. Implementación de los primeros controladores REST (`MatchRESTController`) y mapeo de entidades mediante `MapStruct` y `Lombok`.
* **Frontend (React):** Creación de la SPA (Single Page Application). Implementación de la vista principal (`home.tsx`, `matches.tsx`), capa de servicios (`match-service.ts`) y componentes base (`Header`, `Footer`).
* **Visualización de Datos:** Integración del cliente frontend con la API REST para la recuperación, mapeo (DTOs) y visualización del listado de eventos deportivos (partidos) en la interfaz.
* **Testing Automatizado:** Implementación de pruebas unitarias, pruebas de integración levantando base de datos real con **Testcontainers** (MySQL), y pruebas End-to-End (E2E) con **Selenium** (ChromeDriver).
* **Integración Continua (CI/CD):** Configuración exitosa de flujos de trabajo en **GitHub Actions** (`Full CI`, `Basic Backend CI`, `Basic Frontend CI`) para automatizar la compilación y ejecución de tests con cada commit.
* **Cobertura de Código:** Integración de reportes de cobertura (Code Coverage) mediante **JaCoCo** para el backend (85% alcanzado) y **Vitest** para el frontend (76% alcanzado).
* **Documentación Técnica:** Creación del archivo `docs/development-guide.md` detallando la arquitectura, configuración del entorno, comandos de compilación y estrategias de CI/CD. Exportación de la documentación de la API REST generada con Springdoc OpenAPI.

### Modificado
* Configuración del ciclo de vida en `pom.xml` para sincronizar correctamente las fases de compilación entre el plugin de compilador de Maven, Lombok, MapStruct y JaCoCo.

---

## [0.1.0-fase1] - 2026-09-18

### Añadido
* **Documentación Principal (`README.md`):**
  * Definición del alcance, objetivos y visión general de BetSphere.
  * Mapa de navegación y tabla funcional detallada para las 12 pantallas del sistema distribuidas por roles (Anónimo, Registrado, Administrador).
  * Diagrama de Gantt en sintaxis Mermaid con la planificación de las 7 fases del TFG.
  * Estrategia de gestión de tareas mediante tablero Kanban en GitHub Projects.
* **Definición de Arquitectura y Stack Tecnológico:**
  * **Backend:** Selección de **Java con Spring Boot** para la construcción de una API REST modular, escalable y segura.
  * **Frontend:** Diseño de interfaz web en formato SPA (Single Page Application) desacoplada para el consumo de servicios REST.
  * **Base de Datos:** Elección de **MySQL** como SGBD relacional, modelado y gestionado mediante Spring Data JPA / Hibernate.
  * **APIs e Integraciones Externas:** Planificación de integración con la **API de Stripe** (en *Test Mode* para la simulación segura de depósitos/retiradas) y consumo de **APIs de datos deportivos externos** para la obtención de eventos, marcadores y cuotas.
* **Diseño e Ingeniería de Software:**
  * Diagrama Entidad-Relación (ERD) en sintaxis Mermaid definiendo entidades, atributos y cardinalidades.
  * Enfoque ético "Family Friendly" enfocado en simulación educativa y juego responsable.
* **Transparencia y Normativa (`USO_IA.md`):**
  * Creación del archivo de registro de uso de herramientas de Inteligencia Artificial acorde a las directrices de la ETSII-URJC.
  * Histórico de los primeros registros detallando prompts, modelos, configuraciones y proceso de validación humana durante la Fase 1.

### Nota sobre la Arquitectura
> **Aviso de fase:** La arquitectura del sistema, el stack tecnológico propuesto (Spring Boot, MySQL, Stripe API) y el modelo de dominio corresponden a la línea base establecida en la **Fase 1 (Diseño y Documentación)**. Dado el carácter iterativo del desarrollo software, esta propuesta técnica está sujeta a modificaciones, refactorizaciones y optimizaciones a lo largo de las Fases 2, 3, 4 y 5.