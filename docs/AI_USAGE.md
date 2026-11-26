# Registro de Uso de Inteligencia Artificial

En este documento se registra de forma continua y transparente el uso de herramientas de Inteligencia Artificial (IA) a lo largo del desarrollo del Trabajo de Fin de Grado de la aplicación web BetSphere.

Hoy en día, la integración de asistentes basados en IA es una competencia técnica fundamental en el desarrollo de software moderno. Por este motivo, el proyecto hace uso de estas tecnologías para potenciar el aprendizaje, agilizar el desarrollo y explorar distintas soluciones técnicas, adaptando el tipo de herramienta a las necesidades específicas de cada fase (desde la definición de requisitos hasta la programación, empaquetado y redacción de la memoria).

### Criterios de uso y responsabilidad

Para garantizar la calidad del proyecto y la integridad académica, el uso de la IA se rige por los siguientes principios:

* **Apoyo, no sustitución:** Las herramientas de IA se utilizan como un complemento para mejorar la productividad y resolver dudas complejas, en ningún caso para sustituir el trabajo, el esfuerzo o el aprendizaje propio.
* **Supervisión y validación:** Soy consciente de que los modelos pueden generar respuestas sesgadas, código obsoleto o información inventada. Por tanto, cualquier fragmento de código, texto o diagrama generado es revisado, comprendido y probado antes de incluirse en el proyecto.
* **Responsabilidad y comprensión:** Como desarrollador del proyecto, asumo la autoría y la responsabilidad total sobre el resultado final que se entrega. Todo el contenido ha sido analizado para asegurar que comprendo plenamente su funcionamiento y su lógica.

A medida que avance el desarrollo de BetSphere, se irá detallando en este documento el registro cronológico de las herramientas utilizadas, indicando su propósito, configuración y contexto de uso.

---

## Registro de actividades con IA

### [Registro 1] - Exploración de temática, alcance y stack tecnológico

* **Fecha:** 05/09/2026
* **Fase:** 1: Definición de temática y funcionalidades.
* **Objetivo:** Explorar la temática inicial de la aplicación (BetSphere), aterrizar la idea general para delimitar un alcance realista para el TFG y evaluar las distintas alternativas tecnológicas a implementar.
* **Herramienta:** Gemini
* **Versión concreta:** Gemini Flash
* **Configuración de la herramienta:** Modo chat conversacional interactivo.
* **Cómo ha sido usada:** 
  * Se le proporcionó una descripción general en lenguaje natural sobre la idea de hacer una plataforma de apuestas deportivas simuladas con toques de red social.
  * Se le pidió que actuara como analista para ayudar a definir qué funcionalidades incluir en un Producto Mínimo Viable (MVP) y cuáles descartar por falta de tiempo o complejidad excesiva.
  * Se debatió sobre las tecnologías más adecuadas para la arquitectura (frontend, backend y bases de datos), pidiendo a la IA que comparara opciones y sugiriera el stack más apropiado para el contexto del TFG.
* **Complementos a la herramienta:** Ninguno (uso directo a través de la interfaz web).
* **Ficheros de contexto:** No se utilizaron ficheros de contexto en esta etapa de conceptualización temprana.
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica en esta interacción.

### [Registro 2] - Alcance funcional por roles y predefinición del modelo de entidades

* **Fecha:** 08/09/2026
* **Fase:** 1: Definición de funcionalidades, usuarios y entidades.
* **Objetivo:** Establecer formalmente el alcance funcional y la matriz de permisos para los roles del sistema (Anónimo, Registrado y Administrador), así como realizar una primera identificación de las entidades clave del modelo de dominio.
* **Herramienta:** Gemini
* **Versión concreta:** Gemini 3.1 Pro / Advanced
* **Configuración de la herramienta:** Modo chat con procesamiento y análisis de documentos adjuntos (PDF).
* **Cómo ha sido usada:** 
  * Se adjuntó la guía de recomendaciones docentes del TFG (`Desarrollo de una aplicación web como TFG v4.pdf`) para asegurar que el desglose de requisitos se alineara con los estándares académicos exigidos.
  * Se detallaron las acciones permitidas por cada perfil de usuario para mapear la matriz de accesos y la navegabilidad entre pantallas.
  * Se realizó una lluvia de ideas asistida para identificar las entidades principales del modelo de datos preliminar (Usuario, Apuesta, Partido/Evento, Competición, Historial de Saldo y Mensaje de Chat) y sus relaciones cardinales antes de formalizar la arquitectura.
* **Complementos a la herramienta:** Lector/visor de documentos PDF integrado en la interfaz de la IA.
* **Ficheros de contexto:** `Desarrollo de una aplicación web como TFG v4.pdf` (documento de pautas metodológicas de la universidad).
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica en esta interacción.

### [Registro 3] - Diseño y prototipado conceptual de las pantallas de la aplicación

* **Fecha:** 12/09/2026
* **Fase:** 1: Definición pantallas.
* **Objetivo:** Traducir la idea funcional completa de BetSphere en prototipos visuales de interfaz para estructurar la maquetación y definir la disposición conceptual de las pantallas principales.
* **Herramienta:** ChatGPT
* **Versión concreta:** ChatGPT (Codex / GPT-4o)
* **Configuración de la herramienta:** Modo chat conversacional con asistencia de maquetación y prototipado de interfaz (UI prototyping).
* **Cómo ha sido usada:** 
  * Se redactó una descripción detallada con la visión global del sistema, especificando los flujos de usuario y las necesidades visuales para los roles anónimo, registrado y administrador.
  * Se solicitó la estructura y maquetación preliminar de las distintas vistas (como la vista de competición, la ficha de partido interactiva con IA y el panel de control del usuario).
  * Se iteró sobre la disposición espacial de los elementos clave de la interfaz (ubicación del cupón lateral de apuestas combinadas, módulo de chat en vivo y contenedor para el resumen analítico generado por IA).
* **Complementos a la herramienta:** Ninguno (uso directo a través de la interfaz web).
* **Ficheros de contexto:** Notas preliminares de especificaciones funcionales acordadas en la etapa de conceptualización.
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica en esta interacción.

### [Registro 4] - Estrategia de Juego Responsable y selección de pasarela de pago simulada (Stripe)

* **Fecha:** 13/09/2026
* **Fase:** 1: Estrategia opara un juego responsable.
* **Objetivo:** Definir las medidas éticas de mitigación frente a los riesgos del juego real (enfoque educativo) y seleccionar la pasarela para gestionar transacciones y recargas de saldo virtual de forma ficticia.
* **Herramienta:** Gemini
* **Versión concreta:** Gemini 3.1 Pro
* **Configuración de la herramienta:** Modo chat enfocado en análisis de requisitos, cumplimiento ético y arquitectura de software.
* **Cómo ha sido usada:** 
  * Se planteó el dilema ético sobre la representación de un entorno de apuestas deportivas en un TFG académico y se solicitaron recomendaciones para encuadrar la aplicación dentro del marco de "Juego Responsable" y simulación educativa sin dinero real.
  * Se analizaron opciones para gestionar el saldo virtual de los usuarios, evaluando la idoneidad de usar una pasarela de pago real en entorno de pruebas frente a un desarrollo propio.
  * La IA argumentó las ventajas de integrar la API de Stripe en modo pruebas (*Test Mode*), permitiendo emular el flujo completo de pago seguro mediante tarjetas de prueba sin manejar dinero ni guardar datos bancarios sensibles en el sistema.
* **Complementos a la herramienta:** Ninguno (uso directo vía interfaz web).
* **Ficheros de contexto:** No.
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica en esta interacción.

### [Registro 5] - Generación de diagramas técnicos (ERD y Gantt) en sintaxis Mermaid

* **Fecha:** 16/09/2026
* **Fase:** 1: Generación de diagramas.
* **Objetivo:** Generar la sintaxis de visualización Mermaid para el diagrama Entidad-Relación (ERD) del modelo de datos y el diagrama de Gantt del cronograma del proyecto a partir de los requisitos y especificaciones previas.
* **Herramienta:** ChatGPT
* **Versión concreta:** ChatGPT (GPT-4o)
* **Configuración de la herramienta:** Modo chat con capacidad de previsualización visual (*Visualize* / ejecución de bloques de renderizado).
* **Cómo ha sido usada:** 
  * Se le proporcionaron en el prompt los detalles técnicos del modelo de dominio: entidades, atributos, tipos de datos, claves y cardinalidades (relaciones 1:1, 1:N y N:M), así como la distribución temporal de las 7 fases del proyecto.
  * Se pidió a la IA que redactara el código Mermaid correspondiente (`erDiagram` para la arquitectura de datos y `gantt` para la planificación), utilizando el renderizado en tiempo real de la interfaz para validar la disposición gráfica.
  * Se ajustaron pequeñas incoherencias de sintaxis y solapamientos de fechas producidos por la IA hasta obtener un código limpio compatible con el visor nativo de Markdown en GitHub.
* **Complementos a la herramienta:** Módulo interno de previsualización/renderizado gráfico de diagramas.
* **Ficheros de contexto:** Borrador interno de especificación de entidades y relaciones de la base de datos de BetSphere.
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica en esta interacción.

### [Registro 6] - Redacción, estructuración y síntesis de la documentación principal (README.md y USO_IA.md)

* **Fecha:** desde 12/09/2026 hasta 18/09/2026
* **Fase:** 1: Redacción de la documentación.
* **Objetivo:** Formatear, maquetar y redactar de forma integral la documentación base del repositorio, estructurando tanto la presentación general del proyecto (`README.md`) como el registro oficial de transparencia de IA (`USO_IA.md`) según las directrices de la ETSII-URJC.
* **Herramienta:** Gemini
* **Versión concreta:** Gemini 3.1 Pro / Advanced
* **Configuración de la herramienta:** Modo chat conversacional con capacidad de análisis mutimodal (lectura de PDF e imágenes de arquitectura) y generación de Markdown avanzado.
* **Cómo ha sido usada:** 
  * **Redacción y maquetación del `README.md`:** Asistencia en la exploración del estado del arte, justificación del stack tecnológico, estructuración conceptual de las 7 fases del proyecto y conversión del diagrama visual de pantallas en una tabla completa de navegabilidad por roles.
  * **Redacción y estructura de `USO_IA.md`:** Definición del marco de responsabilidad ética, principios de uso no sustitutivo y creación del histórico cronológico estandarizado para auditar las interacciones con Inteligencia Artificial.
  * **Revisión y refinamiento:** Corrección de la redacción técnica para mantener un tono profesional de ingeniería y asegurar la coherencia entre todos los documentos del repositorio.
* **Complementos a la herramienta:** Herramientas de procesamiento de archivos (PDF/imágenes) para la lectura e interpretación del mapa de navegación de la aplicación.
* **Ficheros de contexto:** `Desarrollo de una aplicación web como TFG v4.pdf` (normativa académica URJC) y `Diagrama pantallas BetSphere.pdf`.
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica en esta interacción.

### [Registro 7] - Estructuración del CHANGELOG.md y adopción de estándares de versionado

* **Fecha:** 18/09/2026
* **Fase:** Changelog.
* **Objetivo:** Definir e inicializar el archivo `CHANGELOG.md` en la raíz del repositorio siguiendo las especificaciones estándar de versionado para registrar la evolución técnica del proyecto.
* **Herramienta:** Gemini
* **Versión concreta:** Gemini 3.1 Pro / Advanced
* **Configuración de la herramienta:** Modo chat conversacional interactivo.
* **Cómo ha sido usada:** 
  * Se revisaron y analizaron de forma guiada las convenciones de *Keep a Changelog* y *Semantic Versioning (SemVer)* para estructurar adecuadamente el historial del proyecto.
  * Se solicitó a la IA la redacción y maquetación de la primera versión estable de documentación (`[0.1.0-fase1]`), desglosando los hitos en secciones (*Añadido*, *Planificado*).
* **Complementos a la herramienta:** Ninguno (uso directo vía interfaz web).
* **Ficheros de contexto:** Especificaciones oficiales de *Keep a Changelog* y *Semantic Versioning*.
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica en esta interacción.

### [Registro 8] - Gestión Ágil de Tareas y Formalización de Issues (GitHub Projects)

* **Fecha:** 25/09/2026
* **Fase:** 2: Gestión de Proyecto y Metodología.
* **Objetivo:** Estructurar el tablero Kanban en GitHub Projects y estandarizar la redacción de las tareas técnicas (*Issues*) para mantener un flujo de trabajo profesional y trazable.
* **Herramienta:** ChatGPT
* **Versión concreta:** ChatGPT (GPT-4o)
* **Configuración de la herramienta:** Modo chat conversacional orientado a *Project Management* y metodologías ágiles.
* **Cómo ha sido usada:** 
  * Se solicitó asistencia para organizar el *backlog* de tareas pendientes de la Fase 2, priorizando el orden de resolución (backend, testing, CI/CD, documentación).
  * La IA redactó las descripciones de los *Issues* en inglés y en formato Markdown, aplicando una plantilla profesional que incluye el propósito (*Expected outcome*), el alcance de la tarea (*Scope*), los criterios de aceptación (*Acceptance criteria*) y los pasos de validación (*Verification*).
  * Esta asistencia permitió documentar correctamente tareas clave (como la redacción de la *Development Guide* o la exportación de Postman) antes de moverlas a las columnas de *In Progress* y *Done*, simulando un entorno de desarrollo profesional real.
* **Complementos a la herramienta:** Ninguno.
* **Ficheros de contexto:** Contexto del flujo de trabajo, estado actual de la rama y nombres de las tareas pendientes.
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica.

### [Registro 9] - Configuración inicial de Spring Boot y dependencias (Maven)

* **Fecha:** 26/09/2026
* **Fase:** 2: Desarrollo Software (Backend).
* **Objetivo:** Configurar la estructura base del proyecto Spring Boot y definir el árbol de dependencias inicial en Maven para la Fase 2.
* **Herramienta:** ChatGPT
* **Versión concreta:** ChatGPT (GPT-4o)
* **Configuración de la herramienta:** Modo chat como experto en arquitectura Java/Spring.
* **Cómo ha sido usada:** 
  * Se solicitó asistencia para limpiar y estructurar correctamente el archivo `pom.xml` inicial del proyecto.
  * La IA ayudó a organizar las dependencias fundamentales de Spring Boot (Web, Data JPA, Validation), la configuración del conector de base de datos (MySQL) y las herramientas de utilidades, garantizando una base de proyecto sólida y libre de librerías innecesarias.
* **Complementos a la herramienta:** Ninguno.
* **Ficheros de contexto:** Archivo `pom.xml` inicial.
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica.

### [Registro 10] - Desarrollo del Frontend (SPA) y migración a React Router

* **Fecha:** 28/09/2026
* **Fase:** 2: Desarrollo Software (Frontend).
* **Objetivo:** Inicializar el proyecto cliente web (Single Page Application) e implementar el sistema de enrutamiento y navegación.
* **Herramienta:** ChatGPT
* **Versión concreta:** ChatGPT (GPT-4o)
* **Configuración de la herramienta:** Modo chat especializado en React y desarrollo web moderno.
* **Cómo ha sido usada:** 
  * Se utilizó la IA como apoyo para la limpieza del código *boilerplate* generado por defecto al crear el proyecto frontend.
  * Se solicitó asistencia técnica para migrar e implementar la estructura de navegación utilizando **React Router**, definiendo las rutas principales de la aplicación (Home, listado de partidos, etc.).
  * La IA proporcionó ejemplos de estructuración de carpetas y ayudó a definir el esqueleto de componentes base (`Header`, `Footer`).
* **Complementos a la herramienta:** Ninguno.
* **Ficheros de contexto:** Archivos de configuración y enrutamiento del frontend (ej. `App.tsx`, `routes.ts`).
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica.

### [Registro 11] - Estrategia de Pruebas de Integración con Testcontainers

* **Fecha:** 30/09/2026
* **Fase:** 2: Testing automatizado.
* **Objetivo:** Asegurar que el acceso a datos y las consultas a la base de datos funcionan en un entorno lo más parecido a producción posible, evitando bases de datos en memoria (H2).
* **Herramienta:** ChatGPT
* **Versión concreta:** ChatGPT (GPT-4o)
* **Configuración de la herramienta:** Modo chat especializado en QA y Testing.
* **Cómo ha sido usada:** 
  * Se debatió sobre la fragilidad de usar H2 para tests si en producción se usa MySQL.
  * La IA guio el proceso de implementación de **Testcontainers**, proporcionando la configuración necesaria para levantar contenedores Docker de MySQL efímeros durante la fase de ejecución de pruebas de Maven.
* **Complementos a la herramienta:** Ninguno.
* **Ficheros de contexto:** Ninguno.
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica.

### [Registro 12] - Configuración de Pruebas End-to-End (E2E) con Selenium

* **Fecha:** 02/10/2026
* **Fase:** 2: Testing automatizado.
* **Objetivo:** Automatizar la simulación del comportamiento de un usuario real navegando por el frontend y consumiendo la API de BetSphere.
* **Herramienta:** ChatGPT
* **Versión concreta:** ChatGPT (GPT-4o)
* **Configuración de la herramienta:** Modo chat conversacional.
* **Cómo ha sido usada:** 
  * Se exploraron alternativas para pruebas de UI y se seleccionó Selenium con ChromeDriver.
  * La IA proporcionó los *scripts* iniciales de configuración para inicializar el navegador en modo *headless* (sin interfaz gráfica) para que fuera compatible con servidores de Integración Continua.
* **Complementos a la herramienta:** Ninguno.
* **Ficheros de contexto:** Entorno general de testing del proyecto.
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica.

### [Registro 13] - Orquestación de Integración Continua en GitHub Actions

* **Fecha:** 04/10/2026
* **Fase:** 2: DevOps y CI/CD.
* **Objetivo:** Automatizar la ejecución de las pruebas y la validación del código cada vez que se suben cambios al repositorio.
* **Herramienta:** ChatGPT
* **Versión concreta:** ChatGPT (GPT-4o)
* **Configuración de la herramienta:** Modo chat como ingeniero DevOps.
* **Cómo ha sido usada:** 
  * Se le pidió crear los flujos de trabajo en formato YAML para GitHub Actions.
  * La IA generó las canalizaciones de `Basic Backend CI`, `Basic Frontend CI` y `Full CI`, configurando correctamente la instalación de Java 21, Node.js y la caché de dependencias para optimizar los tiempos de ejecución en la nube.
* **Complementos a la herramienta:** Ninguno.
* **Ficheros de contexto:** Capturas de pantalla de la interfaz de GitHub Actions.
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica.

### [Registro 14] - Resolución de conflictos de ciclo de vida en Maven (Troubleshooting)

* **Fecha:** 06/10/2026
* **Fase:** 2: Depuración (Troubleshooting) y Backend.
* **Objetivo:** Resolver un error de compilación crítico donde los *Mappers* dejaban de generarse, causando el fallo masivo de los tests locales.
* **Herramienta:** ChatGPT
* **Versión concreta:** ChatGPT (GPT-4o)
* **Configuración de la herramienta:** Modo chat analítico y resolución de problemas (Debugging).
* **Cómo ha sido usada:** 
  * Se reportó un problema donde el proyecto fallaba en silencio y no generaba la clase `MatchMapperImpl`.
  * La IA analizó la configuración de construcción e identificó una colisión entre los plugins de `Lombok`, `MapStruct` y `JaCoCo`. 
  * Proporcionó el fragmento XML refactorizado para el `maven-compiler-plugin` definiendo el orden estricto de los *annotation processors*, restaurando el éxito de la compilación (`BUILD SUCCESS`).
* **Complementos a la herramienta:** Ninguno.
* **Ficheros de contexto:** Archivo `pom.xml`.
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica.

### [Registro 15] - Estabilización del entorno de desarrollo (VS Code Classpath)

* **Fecha:** 07/10/2026
* **Fase:** 2: Entorno de Desarrollo (IDE).
* **Objetivo:** Sincronizar el editor de código con los cambios profundos realizados en el sistema de construcción de Maven.
* **Herramienta:** ChatGPT
* **Versión concreta:** ChatGPT (GPT-4o)
* **Configuración de la herramienta:** Modo chat interactivo.
* **Cómo ha sido usada:** 
  * Tras modificar el `pom.xml`, el IDE reportaba errores falsos positivos. Se proporcionaron capturas de las alertas de Visual Studio Code.
  * La IA identificó la necesidad de forzar la limpieza del *Java classpath* y guio paso a paso sobre cómo actualizar el proyecto interno del editor utilizando los comandos nativos de la extensión de Java (`Java: Update Project`).
* **Complementos a la herramienta:** Lector de imágenes integrado.
* **Ficheros de contexto:** Capturas de pantalla de la interfaz de VS Code (`Project configuration is not up-to-date`).
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica.

### [Registro 16] - Extracción y análisis de métricas de cobertura (Code Coverage)

* **Fecha:** 07/10/2026
* **Fase:** 2: Calidad de Software.
* **Objetivo:** Registrar formalmente el porcentaje de código cubierto por pruebas automatizadas tanto en cliente como en servidor para la rúbrica del TFG.
* **Herramienta:** ChatGPT
* **Versión concreta:** ChatGPT (GPT-4o)
* **Configuración de la herramienta:** Modo chat analítico.
* **Cómo ha sido usada:** 
  * Se suministraron los volcados de texto plano generados por la terminal al ejecutar los *suites* de test.
  * La IA analizó la matriz de cobertura de `Vitest` (Frontend) extrayendo un 76% global de las líneas.
* **Complementos a la herramienta:** Ninguno.
* **Ficheros de contexto:** Logs crudos de la ejecución de pruebas en la terminal de Node/Vite.
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica.

### [Registro 17] - Redacción técnica de la Guía de Desarrollo (`development-guide.md`)

* **Fecha:** 07/10/2026
* **Fase:** 2: Documentación técnica.
* **Objetivo:** Crear un manual de *onboarding* para asentar la arquitectura y explicar cómo ejecutar BetSphere en un entorno local de forma estandarizada.
* **Herramienta:** ChatGPT
* **Versión concreta:** ChatGPT (GPT-4o)
* **Configuración de la herramienta:** Modo chat orientado a *Technical Writing*.
* **Cómo ha sido usada:** 
  * Se solicitó apoyo para redactar un archivo Markdown robusto.
  * La IA estructuró secciones claras abarcando prerrequisitos, clonación del repositorio, ejecución de los servidores locales (comandos `mvnw` y `npm run dev`), y enlazó el registro fotográfico del éxito de la Integración Continua.
* **Complementos a la herramienta:** Ninguno.
* **Ficheros de contexto:** Contexto acumulado de la arquitectura de las fases 1 y 2.
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica.

### [Registro 18] - Elaboración de "Documentación Ejecutable" (Colecciones de Postman)

* **Fecha:** 07/10/2026
* **Fase:** 2: Documentación de API y cierre de fase.
* **Objetivo:** Exportar un entorno de pruebas listo para usar por cualquier desarrollador que quiera probar los *endpoints* del backend sin tener que configurar clientes HTTP desde cero.
* **Herramienta:** ChatGPT
* **Versión concreta:** ChatGPT (GPT-4o)
* **Configuración de la herramienta:** Modo chat interactivo y análisis de interfaz.
* **Cómo ha sido usada:** 
  * Se usó la IA para estructurar correctamente las variables de entorno dinámicas en Postman (`{{base_url}}`).
  * La IA asistió, mediante el análisis de capturas de pantalla, en la detección de un error de exportación (variables guardadas vacías). 
  * Proporcionó la solución para corregir el archivo JSON exportado manualmente, asegurando que la ruta y los valores estuvieran íntegros antes de subirlos al control de versiones bajo la rama `docs/p2-18-postman-collection`.
* **Complementos a la herramienta:** Visor de imágenes para depuración visual de la interfaz de Postman.
* **Ficheros de contexto:** Código del controlador, capturas de Postman y archivo crudo `BetSphere API.postman_collection.json`.
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica.

### [Registro 19] - Configuración de JaCoCo y refactorización de MapStruct

* **Fecha:** 08/10/2026
* **Fase:** 2: Testing automatizado y Calidad de Software.
* **Objetivo:** Garantizar la generación del reporte de métricas de cobertura con JaCoCo (superando el 70%) y resolver un error crítico de inyección de dependencias en el entorno de pruebas.
* **Herramienta:** ChatGPT
* **Versión concreta:** ChatGPT (GPT-4o)
* **Configuración de la herramienta:** Modo chat analítico y resolución de problemas (Debugging avanzado).
* **Cómo ha sido usada:** 
  * Se reportó un error persistente (`Failed to load ApplicationContext`) que impedía a los tests arrancar el contexto de Spring.
  * La IA diagnosticó que el problema se debía a un conflicto entre la compilación automática de VS Code y el ciclo de vida de Maven, lo que provocaba la desaparición de la clase `MatchMapperImpl`.
  * Como solución arquitectónica, la IA guio la refactorización del `MatchMapper`, desvinculándolo del contenedor de Spring (`componentModel="spring"`) para usar el patrón *Factory* nativo de MapStruct (`Mappers.getMapper()`), estabilizando la *build* y permitiendo extraer el informe HTML de JaCoCo con un 75% de cobertura global.
* **Complementos a la herramienta:** Ninguno.
* **Ficheros de contexto:** Archivos `pom.xml`, logs de error de `maven-surefire-plugin` (terminal) y código fuente de `MatchMapper.java` y `MatchRESTController.java`.
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica.

### [Registro 20] - Revisión general, limpieza del repositorio y cierre de la Fase 2

* **Fecha:** 08/10/2026
* **Fase:** 2: Gestión de Proyecto y Mantenimiento.
* **Objetivo:** Auditar los archivos del proyecto, sanear el control de versiones e integrar todo el trabajo final en la rama `chore/p2-wrap-up` antes del *merge* definitivo.
* **Herramienta:** ChatGPT
* **Versión concreta:** ChatGPT (GPT-4o)
* **Configuración de la herramienta:** Modo chat como ingeniero DevOps.
* **Cómo ha sido usada:** 
  * Se consultó a la IA sobre la naturaleza de diversos directorios generados automáticamente durante el desarrollo (`.react-router/` en Vite y `.vscode/` en la raíz).
  * La IA explicó su propósito y dictó las instrucciones exactas para excluirlos mediante los archivos `.gitignore` e invalidar la caché de Git (`git rm -r --cached`).
  * Finalmente, guio la estrategia de *commits* para empaquetar de forma limpia estos últimos ajustes, dando por estabilizada y cerrada la Fase 2 del proyecto.
* **Complementos a la herramienta:** Análisis de capturas de pantalla de la estructura del explorador de archivos.
* **Ficheros de contexto:** Archivos `.gitignore` (raíz y frontend) y estructura del árbol de directorios del editor.
* **Herramientas basadas en ficheros (Spec Driven Development):** No aplica.

> Los registros de la Fase 3 agrupan actividades relacionadas. Las fechas de referencia sitúan cada actividad en el periodo de trabajo y se han contrastado con el historial del proyecto. Los registros describen la asistencia por tema, no el contenido de cada conversación. La asignación de GPT-6.1 Sol se basa en el uso habitual indicado por el autor. Los niveles de razonamiento son estimaciones según la dificultad de cada actividad. GPT-6.2 Sol figura solo en las sesiones recientes en las que consta su uso.

### [Registro 21] - Planificación de la Fase 3 y distribución de issues

* **Fecha:** Desde el 15/10/2026 (fecha de inicio aproximada)
* **Fase:** 3: Planificación y seguimiento.
* **Objetivo:** Organizar el trabajo de la fase en tareas revisables y ordenar sus dependencias.
* **Herramienta:** ChatGPT
* **Versión concreta:** GPT-6.1 Sol (razonamiento bajo).
* **Configuración de la herramienta:** Chat conversacional para planificar tareas y redactar borradores de issues.
* **Cómo ha sido usada:**
  * Se agrupó el trabajo de la fase en varios bloques, desde las funcionalidades del MVP y las pruebas hasta el empaquetado y la documentación.
  * La asistencia se utilizó para redactar alcances y criterios de aceptación, y para ajustar el orden de trabajo en GitHub Projects.
* **Complementos a la herramienta:** GitHub Issues y GitHub Projects como fuentes de planificación.
* **Ficheros de contexto:** Guía del TFG y listado de issues de la Fase 3.
* **Herramientas basadas en ficheros (Spec Driven Development):** Los issues y sus criterios se usaron como referencia para delimitar tareas.

### [Registro 22] - Seguridad del backend, JWT y acceso por rol

* **Fecha:** 19/10/2026–21/10/2026 (periodo de trabajo de referencia)
* **Fase:** 3: Backend y seguridad.
* **Objetivo:** Proteger los recursos de la API y distinguir los permisos de visitante, usuario registrado y administrador.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.1 Sol (razonamiento alto).
* **Configuración de la herramienta:** Asistencia sobre Java y Spring Security.
* **Cómo ha sido usada:**
  * Se usó la IA para revisar la configuración de Spring Security, el filtro JWT y el servicio que carga al usuario a partir de su identidad.
  * Se revisaron el inicio de sesión, la emisión y renovación de tokens, el tratamiento de peticiones sin autenticar y las reglas de acceso por ruta y rol. Se distinguieron la autenticación y la autorización sobre los recursos.
* **Complementos a la herramienta:** Consulta del repositorio, archivos de configuración o resultados de pruebas según la tarea.
* **Ficheros de contexto:** `SecurityConfig`, `JwtRequestFilter`, `JwtTokenProvider`, `UserLoginService` y `RepositoryUserDetailsService`.
* **Herramientas basadas en ficheros (Spec Driven Development):** Se usaron las tareas y los archivos indicados como contexto para orientar la asistencia.

### [Registro 23] - Gestión de usuarios y API de perfil

* **Fecha:** 21/10/2026–26/10/2026 (periodo de trabajo de referencia)
* **Fase:** 3: Backend y cuentas.
* **Objetivo:** Crear una API de cuentas con validación, permisos y respuestas que expongan únicamente los datos previstos.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.1 Sol (razonamiento medio).
* **Configuración de la herramienta:** Revisión de controladores, servicios y contratos REST.
* **Cómo ha sido usada:**
  * La asistencia cubrió las operaciones de registro, listado paginado, consulta y gestión de cuentas y la consulta del usuario autenticado.
  * Se revisaron los DTO de alta y actualización, el mapeo de datos y las diferencias entre las acciones de un titular y las de un administrador. Se homogeneizó el tratamiento de respuestas y errores.
* **Complementos a la herramienta:** Consulta del repositorio, archivos de configuración o resultados de pruebas según la tarea.
* **Ficheros de contexto:** `UserRestController`, `UserService`, `UserRepository`, `User` y DTO y mapeadores de usuario.
* **Herramientas basadas en ficheros (Spec Driven Development):** Se usaron las tareas y los archivos indicados como contexto para orientar la asistencia.

### [Registro 24] - Modelo persistente y API del catálogo deportivo

* **Fecha:** 22/10/2026–27/10/2026 (periodo de trabajo de referencia)
* **Fase:** 3: Backend y arquitectura.
* **Objetivo:** Organizar el catálogo y reflejar su estructura en entidades, repositorios, servicios y controladores.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.1 Sol (razonamiento alto).
* **Configuración de la herramienta:** Asistencia de diseño y revisión de código Java, JPA y Spring MVC.
* **Cómo ha sido usada:**
  * Se revisó el modelo de deportes, competiciones, equipos y partidos, incluida la pertenencia de competiciones a deportes, la asociación de equipos y los participantes de cada partido.
  * Se trabajó sobre las rutas REST y sus DTO de listado y detalle, los filtros y la paginación. La asistencia sirvió para revisar qué responsabilidad correspondía al controlador, al servicio, al repositorio o al mapeador.
  * Se revisaron la carga configurable de datos de ejemplo, el tratamiento de errores y las restricciones de autorización de las operaciones de escritura.
* **Complementos a la herramienta:** Consulta del repositorio, archivos de configuración o resultados de pruebas según la tarea.
* **Ficheros de contexto:** Entidades de `backend/src/main/java/`, controladores del catálogo, servicios, repositorios, mapeadores y `DatabaseInitializer`.
* **Herramientas basadas en ficheros (Spec Driven Development):** Se usaron las tareas y los archivos indicados como contexto para orientar la asistencia.

### [Registro 25] - Migración a HTTPS y ajuste de clientes y pruebas

* **Fecha:** 26/10/2026–03/11/2026 (periodo de trabajo de referencia)
* **Fase:** 3: Infraestructura y comunicación cliente-servidor.
* **Objetivo:** Ejecutar Spring Boot con HTTPS y mantener operativas las llamadas al backend durante el desarrollo y las pruebas.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.1 Sol (razonamiento alto).
* **Configuración de la herramienta:** Asistencia de configuración y diagnóstico a partir de código y salidas de consola.
* **Cómo ha sido usada:**
  * Se revisaron las propiedades TLS, el papel del `keystore.jks` y las diferencias entre las credenciales del almacén y de la clave. Se revisó cómo se transmiten las variables sin incorporar sus valores privados a la documentación.
  * Se adaptaron la URL del backend, el proxy de Vite y las configuraciones y puertos de las pruebas que todavía apuntaban a HTTP.
* **Complementos a la herramienta:** Consulta del repositorio, archivos de configuración o resultados de pruebas según la tarea.
* **Ficheros de contexto:** `application.properties`, `frontend/vite.config.ts`, configuración de HTTPS y pruebas de navegador e integración.
* **Herramientas basadas en ficheros (Spec Driven Development):** Se usaron las tareas y los archivos indicados como contexto para orientar la asistencia.

### [Registro 26] - Imagen Docker y entornos de Compose

* **Fecha:** 26/10/2026 (periodo de trabajo de referencia)
* **Fase:** 3: Empaquetado e infraestructura.
* **Objetivo:** Construir y ejecutar el MVP con la SPA y el servidor en una imagen, acompañados de la base de datos y el almacenamiento de objetos.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.1 Sol (razonamiento medio).
* **Configuración de la herramienta:** Asistencia sobre Dockerfile, Compose y configuración de entornos.
* **Cómo ha sido usada:**
  * Se revisó el empaquetado por etapas, la incorporación de la salida del frontend al backend y el arranque del JAR resultante.
  * Se trabajó sobre la configuración de Compose de desarrollo y de distribución, las variables de entorno, los puertos, los volúmenes y las dependencias de arranque.
* **Complementos a la herramienta:** Consulta del repositorio, archivos de configuración o resultados de pruebas según la tarea.
* **Ficheros de contexto:** `docker/dockerfile`, `docker/docker-compose.yml` y `docker/docker-compose-dev.yml`.
* **Herramientas basadas en ficheros (Spec Driven Development):** Se usaron las tareas y los archivos indicados como contexto para orientar la asistencia.

### [Registro 27] - Almacenamiento de imágenes con MinIO y API compatible con S3

* **Fecha:** 26/10/2026–05/11/2026 (periodo de trabajo de referencia)
* **Fase:** 3: Backend, almacenamiento e integración web.
* **Objetivo:** Guardar y recuperar avatares, iconos y logos desde un servicio de objetos.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.1 Sol (razonamiento alto).
* **Configuración de la herramienta:** Asistencia de integración entre Spring Boot, almacenamiento S3 y formularios del cliente.
* **Cómo ha sido usada:**
  * Se revisaron la configuración del cliente S3 y del bucket, el servicio de almacenamiento y la separación entre la referencia persistida y el archivo almacenado.
  * Se trabajó en las rutas de carga y consulta, el uso de `multipart/form-data`, la validación de archivos y los permisos para modificar imágenes del catálogo o el avatar propio.
  * Se revisaron la selección, el envío y la visualización de imágenes en el panel de administración y el perfil.
* **Complementos a la herramienta:** Consulta del repositorio, archivos de configuración o resultados de pruebas según la tarea.
* **Ficheros de contexto:** `S3StorageConfig`, `ImageStorageService`, `ImageRestController`, controladores del catálogo y rutas `admin.tsx` y `profile.tsx`.
* **Herramientas basadas en ficheros (Spec Driven Development):** Se usaron las tareas y los archivos indicados como contexto para orientar la asistencia.

### [Registro 28] - Servicios del frontend, rutas y clientLoader

* **Fecha:** 27/10/2026–06/11/2026 (periodo de trabajo de referencia)
* **Fase:** 3: Frontend y consumo de la API.
* **Objetivo:** Conectar las pantallas del catálogo con el backend y ordenar la carga de datos.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.1 Sol (razonamiento medio).
* **Configuración de la herramienta:** Asistencia sobre React, TypeScript y React Router.
* **Cómo ha sido usada:**
  * Se revisaron los servicios de deportes, competiciones, partidos y equipos y su correspondencia con los DTO del backend.
  * Se trabajó con `clientLoader` para resolver parámetros de ruta, cargar datos de listado o detalle y trasladarlos a las vistas. Se revisaron la navegación entre entidades, la presentación de fechas, la carga incremental y las páginas de error.
* **Complementos a la herramienta:** Consulta del repositorio, archivos de configuración o resultados de pruebas según la tarea.
* **Ficheros de contexto:** `frontend/app/routes/`, `frontend/app/services/`, `frontend/app/dtos/`, `LoadMore.tsx` y componentes de error.
* **Herramientas basadas en ficheros (Spec Driven Development):** Se usaron las tareas y los archivos indicados como contexto para orientar la asistencia.

### [Registro 29] - Sesión del cliente, cliente HTTP y operaciones de administración

* **Fecha:** 04/11/2026–08/11/2026 (periodo de trabajo de referencia)
* **Fase:** 3: Frontend, integración y administración.
* **Objetivo:** Unificar las llamadas al backend y coordinar el estado de sesión con las operaciones protegidas de la interfaz.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.1 Sol (razonamiento alto).
* **Configuración de la herramienta:** Asistencia sobre servicios TypeScript, estado de sesión y acciones de React Router.
* **Cómo ha sido usada:**
  * Se revisaron el registro, el inicio y cierre de sesión, el estado compartido con Zustand, la restauración de la sesión y el acceso a las rutas privadas y de administrador.
  * Se centralizó la gestión de peticiones, errores y renovación del token en el cliente HTTP. Se revisaron las respuestas ante sesión caducada y la repetición de llamadas tras la renovación.
  * Se trabajó en los formularios del panel de administración, su uso de `clientAction` y `useFetcher`, la recarga de datos tras guardar y la integración de las subidas del perfil. También se revisó el tratamiento de nombres duplicados.
* **Complementos a la herramienta:** Consulta del repositorio, archivos de configuración o resultados de pruebas según la tarea.
* **Ficheros de contexto:** `api-client.ts`, `auth-service.ts`, `auth-token.ts`, `auth-store.ts`, `auth-guards.ts`, `admin-actions.ts`, `admin.tsx` y `profile.tsx`.
* **Herramientas basadas en ficheros (Spec Driven Development):** Se usaron las tareas y los archivos indicados como contexto para orientar la asistencia.

### [Registro 30] - Pruebas de autenticación, registro y cuenta

* **Fecha:** 10/11/2026–11/11/2026 (periodo de trabajo de referencia)
* **Fase:** 3: Pruebas automatizadas.
* **Objetivo:** Comprobar el ciclo de sesión y el acceso al perfil desde la API y el navegador.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.1 Sol (razonamiento medio).
* **Configuración de la herramienta:** Asistencia de diseño de casos y depuración de pruebas.
* **Cómo ha sido usada:**
  * Se cubrieron el registro y el límite de edad, el inicio de sesión, la restauración automática, la renovación del token y el cierre de sesión.
  * Se revisaron las comprobaciones de expiración de la cookie y la sincronización de las pruebas de navegador con el refresco inicial. Se añadieron casos de formularios, perfil, actividad y subida de avatar usando almacenamiento compatible con S3.
* **Complementos a la herramienta:** Consulta del repositorio, archivos de configuración o resultados de pruebas según la tarea.
* **Ficheros de contexto:** Issue #67, `LoginApiE2ETest`, `RegistrationApiE2ETest`, `AccountDatabaseIntegrationTest`, `AvatarApiE2ETest` y suites de Vitest.
* **Herramientas basadas en ficheros (Spec Driven Development):** Se usaron las tareas y los archivos indicados como contexto para orientar la asistencia.

### [Registro 31] - Pruebas del catálogo, administración y almacenamiento

* **Fecha:** 10/11/2026–12/11/2026 (periodo de trabajo de referencia)
* **Fase:** 3: Pruebas unitarias, integración y E2E.
* **Objetivo:** Verificar los recorridos del catálogo y las operaciones de administración en las capas que los ejecutan.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.1 Sol (razonamiento alto).
* **Configuración de la herramienta:** Asistencia sobre JUnit, REST Assured, Selenium, Testcontainers y Vitest.
* **Cómo ha sido usada:**
  * Se trabajó en casos de navegación por deportes, calendario de competiciones, fichas de equipos y partidos, cuotas de referencia y paginación comprobada en varias capas.
  * Se revisaron casos de acceso y listado de usuarios en administración, formularios CRUD del catálogo y validación de subidas de imágenes. Se utilizó un almacenamiento compatible con S3 en las pruebas que requerían persistir archivos.
  * Se revisó la reutilización del servidor Vite entre pruebas de navegador y el arranque de los servicios de prueba.
* **Complementos a la herramienta:** Consulta del repositorio, archivos de configuración o resultados de pruebas según la tarea.
* **Ficheros de contexto:** Issues #68 y #69, `AdminOperationsApiE2ETest`, `AdminImageApiE2ETest`, `CatalogDatabaseIntegrationTest`, `BrowserClientApiIntegrationTest` y suites del cliente.
* **Herramientas basadas en ficheros (Spec Driven Development):** Se usaron las tareas y los archivos indicados como contexto para orientar la asistencia.

### [Registro 32] - Reorganización de pruebas, cobertura e integración continua

* **Fecha:** 12/11/2026–18/11/2026 (periodo de trabajo de referencia)
* **Fase:** 3: Calidad e integración continua.
* **Objetivo:** Ordenar las suites, ampliar la cobertura del cliente y asegurar que Basic CI y Full CI ejecuten las comprobaciones previstas.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.1 Sol (razonamiento alto).
* **Configuración de la herramienta:** Asistencia sobre configuración de pruebas, análisis estático y workflows de GitHub Actions.
* **Cómo ha sido usada:**
  * Se reorganizaron las suites por nivel, se ampliaron las pruebas de rutas y se revisaron los umbrales de Vitest y la generación de informes.
  * Se revisaron los fallos de compilación y de aserciones tras el cambio de textos de interfaz, ajustes de Selenium y la integración de ESLint en los workflows.
  * Se contrastó qué ejecuta cada workflow para distinguir las comprobaciones rápidas de las suites completas.
* **Complementos a la herramienta:** Consulta del repositorio, archivos de configuración o resultados de pruebas según la tarea.
* **Ficheros de contexto:** `docs/testing-structure.md`, `frontend/vitest.config.ts`, configuración de ESLint y `.github/workflows/basic-backend.yml`, `basic-frontend.yml` y `full-ci.yml`.
* **Herramientas basadas en ficheros (Spec Driven Development):** Se usaron las tareas y los archivos indicados como contexto para orientar la asistencia.

### [Registro 33] - Revisión del diseño de la interfaz

* **Fecha:** 16/11/2026–19/11/2026 (periodo aproximado)
* **Fase:** 3: Frontend del MVP.
* **Objetivo:** Definir cambios de interfaz aplicables a la portada, el catálogo y las pantallas de cuenta.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.1 Sol (razonamiento medio).
* **Configuración de la herramienta:** Consulta y asistencia de diseño a partir de la interfaz existente y de las indicaciones del autor.
* **Cómo ha sido usada:**
  * Se solicitó ayuda para mejorar la jerarquía visual, variar las composiciones de pantalla y dar más presencia a los logos del catálogo.
  * Se revisaron ideas para añadir interacción al inicio de sesión y al registro, y para aprovechar mejor el espacio en las portadas de las vistas.
* **Complementos a la herramienta:** Taste Skill (`Leonxlnx/taste-skill`) como referencia de diseño solicitada.
* **Ficheros de contexto:** Interfaz de BetSphere y requisitos visuales compartidos en la conversación.
* **Herramientas basadas en ficheros (Spec Driven Development):** Los requisitos visuales del autor guiaron la revisión de las pantallas.

### [Registro 34] - Entrega continua y generación manual de builds

* **Fecha:** 21/11/2026 (periodo de trabajo de referencia)
* **Fase:** 3: Entrega y publicación de artefactos.
* **Objetivo:** Publicar una build de desarrollo a partir de main y generar builds manuales con una referencia trazable.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.1 Sol (razonamiento alto).
* **Configuración de la herramienta:** Asistencia sobre GitHub Actions, Docker Hub y publicación de Compose OCI.
* **Cómo ha sido usada:**
  * Se trabajó sobre el workflow reutilizable de publicación para construir la imagen y publicar el Compose OCI con etiquetas correspondientes. Se revisó cómo identificar la build por SHA y cómo utilizar los secretos de GitHub Actions.
  * Se revisaron el flujo automático que publica `dev` desde `main` y el despacho manual por rama y commit opcional, con la referencia del artefacto en la salida del workflow.
* **Complementos a la herramienta:** Consulta del repositorio, archivos de configuración o resultados de pruebas según la tarea.
* **Ficheros de contexto:** Issues #75 y #76, `continuous-delivery.yml`, `manual-build.yml` y `publish-artifacts.yml`.
* **Herramientas basadas en ficheros (Spec Driven Development):** Se usaron las tareas y los archivos indicados como contexto para orientar la asistencia.

### [Registro 35] - Preparación de versiones y flujo de GitHub Releases

* **Fecha:** 22/11/2026 (periodo de trabajo de referencia)
* **Fase:** 3: Versionado y entrega continua.
* **Objetivo:** Preparar el proceso que sincroniza las versiones y publica una release cuando se lanza desde GitHub.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.1 Sol (razonamiento alto).
* **Configuración de la herramienta:** Asistencia sobre workflows y scripts de validación en Node.js.
* **Cómo ha sido usada:**
  * Se revisaron los cambios coordinados de versión en Maven, npm, el lockfile y Docker Compose, y la generación de PR para preparar la versión de release o la siguiente de desarrollo.
  * Se trabajó en validar el commit etiquetado y publicar las etiquetas de versión y `latest` para la imagen y el artefacto OCI. También se revisaron las pruebas de los scripts que validan las versiones.
  * La configuración del flujo quedó registrada como trabajo de la fase. La publicación efectiva de la primera release 0.1 siguió pendiente.
* **Complementos a la herramienta:** Consulta del repositorio, archivos de configuración o resultados de pruebas según la tarea.
* **Ficheros de contexto:** Issues #77 y #78, `github-release.yml`, `prepare-version.yml`, `.github/scripts/prepare-release.mjs` y `.github/scripts/set-versions.mjs`.
* **Herramientas basadas en ficheros (Spec Driven Development):** Se usaron las tareas y los archivos indicados como contexto para orientar la asistencia.

### [Registro 36] - Descripción funcional y selección de capturas de la 0.1

* **Fecha:** 23/11/2026–24/11/2026
* **Fase:** 3: Documentación de funcionalidades.
* **Objetivo:** Describir las funciones disponibles por rol y actualizar el estado de las funcionalidades previstas.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.1 Sol (razonamiento bajo).
* **Configuración de la herramienta:** Asistencia sobre el repositorio con revisión de Markdown, código y capturas.
* **Cómo ha sido usada:**
  * Se agruparon las capturas por flujo y se utilizaron para explicar el catálogo, el acceso a la cuenta, el perfil y el panel de administración.
  * Se contrastó la descripción con el comportamiento de la aplicación para distinguir entre funciones implementadas, parciales y pendientes.
* **Complementos a la herramienta:** Lectura de capturas y revisión de archivos del repositorio.
* **Ficheros de contexto:** `docs/functionalities.md`, `docs/detailed-functionalities.md` y `docs/images/v0.1/`.
* **Herramientas basadas en ficheros (Spec Driven Development):** Los criterios del issue #81 guiaron la revisión de contenidos.

### [Registro 37] - Guía de ejecución, Docker Compose OCI y verificación manual

* **Fecha:** 24/11/2026
* **Fase:** 3: Ejecución y despliegue.
* **Objetivo:** Documentar cómo ejecutar la imagen y el Compose OCI y cómo reutilizar una base de datos existente.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.1 Sol (razonamiento medio).
* **Configuración de la herramienta:** Asistencia de documentación y diagnóstico a partir de los archivos Docker y de la salida de PowerShell.
* **Cómo ha sido usada:**
  * Se identificaron los servicios, las variables requeridas y el uso de los tags `dev`, `latest` y de versión. Se documentó una configuración de demostración con marcadores para el keystore.
  * La IA guio el diagnóstico de Docker Desktop y la prueba de reanudación sin cargar ejemplos. El autor ejecutó el artefacto `dev` y confirmó que la aplicación abría y que se conservaba un deporte creado para la prueba.
  * Se revisó la documentación para evitar copiar datos privados del `.env`. La configuración pública del keystore y la verificación de una release quedaron pendientes.
* **Complementos a la herramienta:** Terminal, Docker Desktop y Docker Compose utilizados por el autor durante las comprobaciones.
* **Ficheros de contexto:** `docs/execution.md`, `docker/docker-compose.yml`, `docker/dockerfile` y salidas de PowerShell.
* **Herramientas basadas en ficheros (Spec Driven Development):** Los criterios del issue #82 guiaron el procedimiento de instalación y comprobación.

### [Registro 38] - Guía de desarrollo, diagramas y proceso de publicación

* **Fecha:** 24/11/2026
* **Fase:** 3: Documentación técnica y entrega continua.
* **Objetivo:** Actualizar la guía de desarrollo para reflejar la arquitectura del MVP y el procedimiento de publicación.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.2 Sol en la sesión de actualización de la guía y los diagramas.
* **Configuración de la herramienta:** Asistencia sobre el repositorio con lectura de código y edición de Markdown y Mermaid.
* **Cómo ha sido usada:**
  * Se derivó el modelo de dominio de las entidades Java y se revisaron las rutas y permisos de la API REST.
  * Se representaron las dependencias del servidor y del cliente en vistas temáticas. Se comprobó el origen de las flechas del servidor en Java y la correspondencia de los imports internos del cliente en TypeScript.
  * Se documentó la publicación de builds de desarrollo y el proceso de preparación de una release a partir de los workflows existentes. La publicación de la primera release quedó pendiente.
* **Complementos a la herramienta:** Terminal para consultar el repositorio y verificar enlaces y dependencias.
* **Ficheros de contexto:** `docs/development-guide.md`, código Java y TypeScript y workflows de `.github/workflows/`.
* **Herramientas basadas en ficheros (Spec Driven Development):** Los criterios del issue #83 se usaron para revisar el contenido de la guía.

### [Registro 39] - Actualización del README y cierre de la documentación de la 0.1

* **Fecha:** 24/11/2026
* **Fase:** 3: Documentación del MVP.
* **Objetivo:** Actualizar la portada del repositorio y recoger los cambios del MVP y su trazabilidad de IA.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.2 Sol en la sesión de actualización del README y de este registro.
* **Configuración de la herramienta:** Agente de edición sobre el repositorio con acceso a Markdown, capturas e historial de Git.
* **Cómo ha sido usada:**
  * Se redactó la presentación de la 0.1, se incorporaron capturas del catálogo, perfil y administración, y se revisaron los enlaces del índice. El vídeo se dejó pendiente de grabación.
  * Se resumieron los cambios de la Fase 3 en el changelog como cambios sin publicar y se agruparon las actividades de IA por objetivo y periodo.
* **Complementos a la herramienta:** Terminal y Git para contrastar cambios y comprobar enlaces.
* **Ficheros de contexto:** `README.md`, `CHANGELOG.md`, `docs/AI_USAGE.md`, la documentación de la Fase 3 y `docs/images/v0.1/`.
* **Herramientas basadas en ficheros (Spec Driven Development):** El issue #80 y la guía del TFG sirvieron de referencia para revisar la portada.

### [Registro 40] - Revisión de la rúbrica y ajustes del MVP

* **Fecha:** 26/11/2026
* **Fase:** 3: Revisión de requisitos, calidad y documentación.
* **Objetivo:** Contrastar el MVP con la rúbrica de la Fase 3 y completar la búsqueda, la paginación y la documentación.
* **Herramienta:** ChatGPT / Codex
* **Versión concreta:** GPT-6.2 Sol durante la implementación y GPT-6.1 Sol durante la revisión final de la documentación.
* **Configuración de la herramienta:** Agente con acceso al repositorio, terminal y consulta de documentación técnica.
* **Cómo ha sido usada:**
  * Se contrastaron la rúbrica y las indicaciones para doble titulación con el código y los workflows. Se preparó la integración de SonarQube Cloud, cuyo primer análisis queda pendiente de activar la integración.
  * Se implementó la búsqueda de partidos por equipo y estado en la API antes de paginar, se conectó con el buscador y se añadieron pruebas de regresión.
  * Se añadió la visualización de diez partidos cada vez en el calendario de competición. Se revisaron las guías, el changelog y el README, y se recuperó la especificación funcional inicial desde Git.
* **Complementos a la herramienta:** Git, PowerShell, Maven, Vitest, TypeScript y ESLint para consultar el historial y comprobar los cambios.
* **Ficheros de contexto:** Rúbrica de la Fase 3, guía del TFG v4, `MatchRestController`, `MatchService`, `MatchRepository`, componentes y servicios del cliente, `.github/workflows/`, pruebas y documentación de la 0.1.
* **Herramientas basadas en ficheros (Spec Driven Development):** La rúbrica y el apartado de doble titulación de la guía del TFG orientaron la revisión del alcance y los cambios.

### [Registro 41] - Imágenes para la demostración

* **Fecha:** 26/11/2026
* **Fase:** 3: Interfaz y datos de ejemplo.
* **Objetivo:** Incorporar imágenes de demostración al catálogo y crear un fondo para las pantallas de la aplicación.
* **Herramienta:** OpenAI ImageGen y ChatGPT / Codex
* **Versión concreta:** ImageGen mediante la herramienta de generación de imágenes y GPT-6.2 Sol para su integración en la aplicación.
* **Configuración de la herramienta:** Generación de imágenes a partir de descripciones y asistencia sobre los recursos y el inicializador del backend.
* **Cómo ha sido usada:**
  * Se generaron las ilustraciones de los balones de fútbol y baloncesto, la pelota de tenis y el fondo de un estadio ficticio para la portada y las pantallas de acceso y registro.
  * Se diseñaron distintivos con iniciales y formas propias para los clubes, las competiciones y los jugadores. Se sustituyeron los escudos y fotografías de terceros que se habían considerado durante la preparación del catálogo.
  * Se integraron 20 PNG en los datos de ejemplo, con almacenamiento en MinIO y URLs en MySQL, y se documentó su origen en los créditos.
* **Complementos a la herramienta:** Generación de PNG con System.Drawing, Git y Maven para preparar y verificar los recursos empaquetados.
* **Ficheros de contexto:** `DatabaseInitializer`, `ImageStorageService`, `backend/src/main/resources/demo-images/`, `frontend/public/matchday-pitch.jpg` y los [créditos de imágenes](../backend/src/main/resources/demo-images/CREDITS.md).
* **Herramientas basadas en ficheros (Spec Driven Development):** Se utilizaron el requisito de datos de ejemplo de la rúbrica y los recursos visuales de la aplicación para definir e integrar las imágenes.
