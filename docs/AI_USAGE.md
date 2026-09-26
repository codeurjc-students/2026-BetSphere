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

### [Registro 7] - 2026-09-18: Estructuración del CHANGELOG.md y adopción de estándares de versionado

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