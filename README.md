<h1>
  <img src="frontend/public/favicon.svg" width="32" height="32" alt="">
  BetSphere: Una aplicación web para seguir eventos deportivos y simular apuestas
</h1>

En **BetSphere 0.1** puedes explorar el catálogo deportivo por deporte y competición, buscar partidos por equipo y comparar las estadísticas de los dos participantes desde la ficha de un encuentro. Con una cuenta puedes iniciar sesión, personalizar tu avatar y volver a los últimos partidos que visitaste desde ese navegador. El panel de administración permite consultar las cuentas y gestionar los deportes, las competiciones, los equipos y sus partidos.

## Capturas de la versión 0.1

| **Portada** | **Ficha de partido** |
| --- | --- |
| ![Portada con el catálogo deportivo y los partidos destacados](docs/images/v0.1/sports-home.png) | ![Ficha con información del encuentro y estadísticas de los equipos](docs/images/v0.1/match.png) |
| Punto de entrada a los deportes y a los partidos destacados. | Consulta del encuentro, comparación de equipos y cuotas de referencia. |
| **Perfil de usuario** | **Panel de administración** |
| ![Perfil de usuario con avatar y saldo virtual](docs/images/v0.1/profile.png) | ![Panel de administración del catálogo deportivo](docs/images/v0.1/admin-catalog.png) |
| Datos de la cuenta, saldo virtual y cambio de avatar. | Gestión de los deportes, las competiciones y los equipos del catálogo. |

## Estado del proyecto

**BetSphere sigue en desarrollo.** En esta fase las cuotas son informativas y el saldo virtual del perfil es de demostración. La simulación de apuestas está pendiente de implementación.

## Vídeo de la versión 0.1

**[Ver la demo de BetSphere 0.1 en YouTube](https://youtu.be/Ru065-V4QDI)**

- **Visitante.** Navegación por la portada, un deporte, una competición y la ficha de un partido.
- **Usuario registrado.** Creación de una cuenta, consulta del perfil y del historial de partidos visitados.
- **Administrador.** Acceso al panel y creación y eliminación de un deporte de ejemplo.

## Próximas versiones

El proyecto prevé incorporar apuestas simples y combinadas con saldo virtual, junto con un historial donde se puedan consultar los pronósticos y su resultado. También está previsto añadir chat durante los encuentros, estadísticas más avanzadas y resúmenes de partidos asistidos por IA. El [estado de cada funcionalidad](docs/detailed-functionalities.md) recoge el alcance previsto y el grado de implementación.

## Índice de documentación

| Sección | Contenido |
| --- | --- |
| [Funcionalidades](docs/functionalities.md) | Recorrido por las pantallas de la 0.1, con capturas y una explicación por tipo de usuario. |
| [Funcionalidades detalladas](docs/detailed-functionalities.md) | Qué está implementado, qué se ha desarrollado parcialmente y qué está pendiente. |
| [Ejecución](docs/execution.md) | Arranque desde el artefacto Docker Compose OCI, cuentas de ejemplo, persistencia y despliegue en otro servidor. |
| [Guía de desarrollo](docs/development-guide.md) | Tecnologías, arquitectura, API REST, pruebas, entrega continua y publicación de versiones. |
| [Estructura de pruebas](docs/testing-structure.md) | Organización de las pruebas del proyecto. |
| [Seguimiento](docs/follow-up.md) | Planificación y evolución del trabajo. |
| [Autor](docs/authors.md) | Autoría del proyecto. |
| [Uso de IA](docs/AI_USAGE.md) | Herramientas utilizadas y registro de su aportación al proyecto. |
| [Historial de cambios](CHANGELOG.md) | Cambios y avances registrados. |

### Inicio del proyecto

| Sección | Contenido |
| --- | --- |
| [Objetivos](docs/objectives.md) | Propósito y alcance del TFG. |
| [Metodología](docs/methodology.md) | Organización del desarrollo. |
| [Funcionalidades iniciales](docs/initial-functionalities.md) | Especificación planteada al iniciar el proyecto. |
| [Análisis](docs/analysis.md) | Requisitos del sistema y características técnicas. |
| [Estado del arte](docs/state-of-art.md) | Contexto y soluciones relacionadas. |

## Uso de IA

Se han utilizado herramientas de inteligencia artificial como apoyo a la investigación, el desarrollo y la documentación de BetSphere. El registro de sus usos, modelos, objetivos y comprobaciones se recoge en [AI_USAGE.md](docs/AI_USAGE.md).

- **Google Gemini.** Apoyo en la investigación del sector, la definición del alcance y las funcionalidades, el estado del arte y la redacción de la documentación.
- **OpenAI Codex.** Asistencia en el diseño de la interfaz, la implementación del backend y el frontend, las pruebas, los workflows y la documentación técnica.
- **OpenAI ImageGen.** Generación de los iconos de los deportes y del fondo del estadio utilizados en la demostración.
