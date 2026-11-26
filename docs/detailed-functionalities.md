# Funcionalidades detalladas

La siguiente lista actualiza las funcionalidades previstas según el comportamiento implementado en la aplicación. **Implementada** indica que la funcionalidad está disponible; **Parcial** indica que solo se ha desarrollado una parte, descrita en la tabla; **Pendiente** indica que todavía no está disponible.

Las funcionalidades disponibles desde la interfaz se presentan con sus capturas en [Funcionalidades de la versión 0.1](functionalities.md). La [especificación inicial](initial-functionalities.md) recoge el alcance definido al comenzar el proyecto.

## Funcionalidad básica

| Rol | Funcionalidad | Estado | Descripción actual |
| :--- | :--- | :--- | :--- |
| Anónimo | Navegación por deportes, competiciones y partidos. | Implementada | Se puede explorar el catálogo, acceder a las competiciones de un deporte y consultar sus equipos y partidos. Las competiciones de un deporte pueden filtrarse por país cuando hay varios disponibles. |
| Anónimo | Consulta estática de cuotas. | Implementada | Los listados y las fichas de partido muestran las cuotas de referencia 1X2 almacenadas: victoria local, empate y victoria visitante. No se actualizan en directo. |
| Anónimo | Simulación de apuesta sin ejecución. | Pendiente | Las cuotas de la ficha están deshabilitadas. No hay selección de pronóstico, introducción de importe ni cálculo de una apuesta simulada. |
| Anónimo | Búsqueda y filtrado de partidos. | Implementada | En el listado general, la API busca por equipo local o visitante y aplica el estado antes de devolver cada página de diez. En una competición, la ficha carga el calendario completo y la interfaz lo filtra y muestra de diez en diez. Los equipos aparecen juntos. |
| Anónimo | Consulta de equipos y comparación de estadísticas. | Implementada | La ficha de equipo muestra sus datos y estadísticas de temporada almacenadas. La ficha de partido permite comparar victorias y goles a favor y en contra y desplegar una tabla con las estadísticas de ambos equipos. |
| Usuario registrado | Registro de cuenta, comprobación de edad e inicio de sesión. | Implementada | El registro solicita usuario, correo, contraseña y fecha de nacimiento y rechaza fechas correspondientes a menores de 18 años. La edad se comprueba sobre la fecha declarada, sin verificación documental. Se inicia sesión con correo y contraseña y se puede cerrar la sesión desde el menú de cuenta. |
| Usuario registrado | Gestión del perfil. | Parcial | La pantalla permite consultar usuario, correo, fecha de nacimiento y saldo virtual y cambiar el avatar. La actualización de usuario, contraseña y fecha de nacimiento y la eliminación de la cuenta están disponibles en la API para el propietario o un administrador, pero no tienen formularios en la interfaz. |
| Usuario registrado | Consulta de deportes, competiciones y partidos. | Implementada | El usuario autenticado conserva el acceso a todas las consultas del catálogo público. |
| Usuario registrado | Realización de apuestas simples. | Pendiente | La herramienta de apuestas de la ficha de partido muestra un aviso de disponibilidad futura. No permite registrar ni liquidar apuestas. |
| Usuario administrador | Acceso al panel de administración. | Implementada | El panel requiere sesión y rol de administrador. Las operaciones de escritura del catálogo están restringidas también en la API. |
| Usuario administrador | Listado de usuarios registrados. | Implementada | La pestaña de usuarios muestra nombre, correo y roles, con búsqueda entre registros cargados y carga de más resultados. Es una vista de consulta. |
| Usuario administrador | Creación y edición de deportes, competiciones y partidos. | Implementada | El panel permite crear y editar deportes y competiciones. En los partidos se seleccionan competición, equipos, fecha, cuotas y estado. Los equipos deben ser distintos y pertenecer a la competición. |
| Usuario administrador | Gestión de equipos e imágenes del catálogo. | Implementada | Se pueden crear equipos vinculados a una competición, editarlos y subir o sustituir imágenes de deportes, competiciones y equipos. La API también permite vincular equipos existentes a una competición y desvincularlos, operaciones sin controles específicos en el panel. |

## Funcionalidad adicional

| Rol | Funcionalidad | Estado | Descripción actual |
| :--- | :--- | :--- | :--- |
| Usuario registrado | Chat en directo de los partidos. | Pendiente | La herramienta de chat muestra un aviso de disponibilidad futura. No se pueden enviar ni consultar mensajes. |
| Usuario registrado | Apuestas combinadas. | Pendiente | No hay cupón de selecciones múltiples ni ejecución de apuestas combinadas. |
| Usuario registrado | Ingresos y retiradas de saldo virtual mediante pasarelas de pago. | Pendiente | El saldo se muestra en el perfil y el historial, pero no hay operaciones de ingreso ni retirada. Las nuevas cuentas se crean con saldo cero. |
| Usuario registrado | Historial de pérdidas y ganancias. | Pendiente | El apartado de actividad de apuestas está vacío. No se muestran apuestas realizadas, movimientos financieros ni gráficos de pérdidas y ganancias. |
| Usuario registrado | Consulta de partidos visitados recientemente. | Implementada | El historial muestra hasta cinco partidos visitados con la sesión iniciada y permite volver a sus fichas. Se guardan por usuario en ese navegador, sin sincronización entre dispositivos. |
| Usuario administrador | Moderación del chat en directo. | Pendiente | No hay chat operativo ni controles para eliminar mensajes. |
| Usuario administrador | Bloqueo, desbloqueo y baneo de usuarios. | Pendiente | El panel solo permite consultar usuarios; no implementa estos controles de moderación. |
| Usuario administrador | Inicio/cierre de eventos y actualización de marcadores. | Parcial | La edición de un partido permite cambiar manualmente su estado entre programado, en directo y finalizado. No hay un flujo específico de inicio/cierre ni campos de marcador o seguimiento en tiempo real. |

## Funcionalidad avanzada

| Rol | Funcionalidad | Estado | Descripción actual |
| :--- | :--- | :--- | :--- |
| Anónimo | Métricas deportivas obtenidas de APIs externas. | Pendiente | Las estadísticas disponibles se consultan desde la base de datos mediante la API propia. No incluyen ingesta desde proveedores deportivos externos. |
| Usuario registrado | Resúmenes analíticos y previas mediante IA generativa. | Pendiente | La herramienta de análisis de la ficha de partido muestra un aviso de disponibilidad futura. No genera resúmenes ni previas. |
| Usuario registrado | Estadísticas avanzadas para asistencia en pronósticos mediante servicios externos. | Pendiente | Se consultan y comparan estadísticas básicas almacenadas, sin servicios externos ni asistencia en pronósticos. |
| Usuario registrado | Procesamiento de saldo mediante Stripe. | Pendiente | No existe integración operativa de pago con Stripe. |
| Usuario administrador | Acceso a las funciones avanzadas de usuario registrado. | Pendiente | Los módulos de IA, estadísticas externas y operaciones financieras tampoco están disponibles para el administrador. |
| Usuario administrador | Gestión avanzada del catálogo: borrado en cascada, ajustes globales de cuotas y analíticas. | Parcial | Se pueden editar las cuotas de cada partido y eliminar registros individualmente. Se impide borrar deportes con competiciones, competiciones con partidos y equipos que participan en partidos. Al borrar un equipo sin partidos se eliminan sus asociaciones con competiciones. No hay borrado en cascada del catálogo, ajustes globales de cuotas ni analíticas del panel. |
