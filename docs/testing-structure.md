# Pruebas de BetSphere

| Tipo | Carpeta | Punto de entrada y ejemplo |
| --- | --- | --- |
| E2E de API REST | `backend/src/test/java/es/codeurjc/betsphere/e2e/api/` | Petición HTTP con Rest Assured. `CompetitionApiE2ETest` comprueba la respuesta de la API de competiciones. |
| E2E de UI | `backend/src/test/java/es/codeurjc/betsphere/e2e/ui/` | Interacción con la interfaz en Chrome. `BetSphereUiE2ETest` comprueba lo que puede hacer y ver el usuario. |
| Integración servidor–base de datos | `backend/src/test/java/es/codeurjc/betsphere/integration/database/` | Llamada a Java con MySQL real. `MatchIntegrationTest` comprueba que el servicio recupera la página solicitada. |
| Integración cliente–API REST | `backend/src/test/java/es/codeurjc/betsphere/integration/clientapi/` | Llamada directa al código TypeScript contra la API real. `BrowserClientApiIntegrationTest` ejecuta ese código en Chrome. |
| Unitaria de servidor | `backend/src/test/java/es/codeurjc/betsphere/unit/service/` | Código Java con dependencias controladas mediante Mockito. `MatchServiceTest` comprueba la lógica de paginación. |
| Unitaria de cliente | `frontend/tests/unit/` | Código TypeScript o componentes React con Vitest. `LoadMore.test.tsx` comprueba la respuesta del botón a sus propiedades y al clic. |

Las pruebas HTTP del catálogo tienen clases dedicadas a deportes, competiciones, equipos, listado de partidos y detalle de partido. Las pruebas HTTP de autenticación y administración también tienen clases propias. Las integraciones de catálogo y cuenta con MySQL se pueden localizar en `CatalogDatabaseIntegrationTest` y `AccountDatabaseIntegrationTest`.

Las dos suites de navegador comparten el arranque de Chrome, Vite, Spring, MySQL y el almacenamiento compatible con S3 mediante `support/BrowserTestSupport.java`. En la E2E de UI el test entra por una interacción como pulsar un botón. En la integración cliente–API el test invoca una función TypeScript y verifica su comunicación con el servidor. Una E2E HTTP también puede verificar que un efecto de la petición se ha persistido. Las integraciones servidor–BD entran directamente por Java.

## Ejecución

El siguiente comando ejecuta todas las pruebas de Maven. Lánzalo desde `backend` en PowerShell con Docker activo y las dependencias del frontend instaladas.

```powershell
.\mvnw.cmd test
```

Este filtro reproduce la selección de Basic Backend CI.

```powershell
.\mvnw.cmd test '-Dtest=!**/e2e/ui/**,!**/integration/clientapi/**'
```

Los comandos de Vitest y de compilación se ejecutan desde `frontend`.

```powershell
npm.cmd run test:coverage
npm.cmd run build
```

Full CI ejecuta todas las suites de Maven con `xvfb-run` en Linux y ejecuta Vitest y la compilación del frontend. Los informes de Maven están en `backend/target/surefire-reports/`. Los informes de cobertura están en `backend/target/site/jacoco/` y `frontend/coverage/`.

