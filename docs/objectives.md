# Objetivos

## Objetivos funcionales

BetSphere tiene como objetivo funcional ofrecer una plataforma web integral para la simulación de apuestas deportivas y el seguimiento de eventos en tiempo real dentro de un entorno seguro y sin riesgo monetario. La aplicación busca transformar la experiencia tradicional del usuario integrando espacios comunitarios de discusión simultánea por partido, análisis explicativos generados por Inteligencia Artificial y una gestión rigurosa de permisos basada en roles, garantizando en todo momento la adherencia a políticas de juego responsable (+18).

- Gestión de usuarios y control de acceso: Autenticación de usuarios, registro con verificación obligatoria de mayoría de edad y segregación estricta de permisos entre perfiles anónimos, registrados y administradores.

- Exploración del catálogo deportivo: Navegación por disciplinas deportivas, ligas y encuentros, permitiendo la visualización detallada de eventos y cuotas dinámicas.

- Motor de simulación de pronósticos: Permitir la configuración y formalización de boletos de apuestas simples y combinadas utilizando exclusivamente un saldo virtual ficticio.

- Interacción social en tiempo real: Salas de chat comunitarias asociadas a cada partido en directo para promover el debate dinámico entre los usuarios conectados.

- Asistencia analítica mediante GenAI: Generación automatizada de resúmenes e interpretaciones estadísticas redactadas en lenguaje natural para orientar la toma de decisiones.

- Gestión de saldo virtual y transacciones: Funcionalidad para simular el depósito y la retirada de fondos ficticios mediante una pasarela de pago en entorno de pruebas.

- Panel de administración y moderación: Herramientas centralizadas para el alta/edición del catálogo deportivo, la resolución manual u operativa de eventos y la moderación de mensajes o bloqueo de usuarios.

## Objetivos técnicos

El proyecto busca diseñar e implementar una arquitectura de software distribuida, robusta y desacoplada. La solución técnica integra un backend desarrollado en Spring Boot, una interfaz SPA (Single Page Application) desarrollada en React y una base de datos relacional MySQL, combinando protocolos de comunicación en tiempo real, consumo de APIs externas de datos y servicios de Inteligencia Artificial Generativa.

- Desarrollo de API RESTful con Spring Boot: Construcción de un servicio backend modular y escalable, aplicando patrones de diseño estándar, persistencia relacional con Spring Data JPA e inversión de control.

- Construcción de interfaz SPA con React: Implementación de un frontend moderno, dinámico y responsivo basado en componentes reutilizables y gestión eficiente del estado global.

- Comunicación bidireccional con WebSockets: Integración del protocolo WebSocket (STOMP/SockJS) para el intercambio instantáneo de mensajes en los chats en directo y la sincronización reactiva de marcadores.

- Mecanismos de seguridad y autorización: Aplicación de Spring Security para el cifrado de contraseñas, gestión de sesiones y comprobación estricta de propiedad de datos a nivel de recurso.

- Ingesta e integración de APIs REST externas: Conexión asíncrona con servicios de terceros para la obtención y actualización automatizada de datos deportivos y cuotas iniciales.

- Procesamiento algorítmico y transaccionalidad: Algoritmos dedicados al cálculo de cuotas acumuladas y ejecución de tareas atómicas en segundo plano para la resolución masiva de boletos sin problemas de concurrencia.

- Integración de servicios de Stripe y LLM: Consumo e integración del SDK de Stripe (modo test) para la simulación de pagos y conexión vía cliente HTTP con modelos de lenguaje para la síntesis de textos analíticos.
