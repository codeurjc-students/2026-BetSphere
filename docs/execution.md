# Ejecución de BetSphere

BetSphere se ejecuta mediante el artefacto Docker Compose OCI publicado en Docker Hub. No es necesario clonar el repositorio, compilar el código ni descargar un archivo YAML adicional. El Compose proporciona la aplicación, MySQL y MinIO para almacenar imágenes.

## Requisitos

| Sistema | Instalación oficial |
| --- | --- |
| Windows | [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/), con contenedores Linux. |
| macOS | [Docker Desktop](https://docs.docker.com/desktop/setup/install/mac-install/), con el instalador correspondiente al procesador. |
| Linux | [Docker Engine](https://docs.docker.com/engine/install/) y [Docker Compose](https://docs.docker.com/compose/install/linux/). |

El motor Docker debe estar arrancado. Se necesita conexión a Docker Hub y los puertos `443`, `9000` y `9001` libres. Comprueba la instalación:

```sh
docker version
docker compose version
```

Los [artefactos OCI](https://docs.docker.com/compose/how-tos/oci-artifact/) requieren Compose 2.34.0 o posterior. El publicador del proyecto utiliza Compose 5.6.1.

## Configuración

El Compose recibe la configuración mediante variables de entorno. Para una instalación nueva de demostración, crea una carpeta de ejecución y, dentro de ella, un archivo de texto llamado `.env`. Mantén esta carpeta separada de tu entorno de desarrollo para no sobrescribir su configuración:

```sh
mkdir betsphere-run
cd betsphere-run
```

Copia este contenido en `.env`:

```dotenv
DB_NAME=betsphere
DB_USER=root
DB_PASSWORD=BetSphereDemoMySQL2026
DB_CONFIG=update
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
S3_REGION=us-east-1
S3_BUCKET=betsphere-images
KEYSTORE_PASSWORD=PENDIENTE_CONTRASENA_DEL_ALMACEN
KEYSTORE_SECRET=PENDIENTE_CONTRASENA_DE_LA_CLAVE
```

La contraseña MySQL anterior es un valor público de demostración, elegido para esta guía. En una base vacía, el Compose configura tanto MySQL como la aplicación con ese mismo valor. `DB_USER=root` corresponde a la cuenta que inicializa el servicio MySQL incluido. `DB_CONFIG=update` permite crear las tablas durante el primer arranque. Los valores de MinIO, la región y el bucket coinciden con los predeterminados del Compose.

**Pendiente antes de ejecutar:** los dos valores `PENDIENTE_...` son marcadores y deben sustituirse por las contraseñas correspondientes al almacén `keystore.jks` incluido en la imagen. La configuración de demostración quedará completa cuando se determine qué credenciales del keystore se pueden distribuir públicamente. No se han copiado contraseñas privadas en este documento.

`keystore.jks` contiene el certificado HTTPS y su clave privada. `KEYSTORE_PASSWORD` desbloquea el almacén y `KEYSTORE_SECRET` desbloquea la clave. Cambiar únicamente las variables del `.env` no modifica las contraseñas del archivo.

Para reutilizar una base ya inicializada, conserva sus credenciales originales en lugar de sustituirlas por las de esta demostración. Cambiar `DB_PASSWORD` no actualiza la contraseña guardada en un volumen existente. Conserva también el bucket y las credenciales de MinIO de esa instalación.

El `.env` con valores propios debe permanecer fuera de Git. Los valores públicos de demostración son adecuados para pruebas locales; el despliegue externo debe utilizar credenciales propias. El Compose y el Dockerfile originales se mantienen sin cambios.

## Última build de desarrollo

Mientras la release `0.1` está pendiente de publicación, puedes usar la build de desarrollo generada desde `main`. Desde la carpeta del `.env`, ejecuta:

```sh
docker compose -p betsphere --env-file .env -f oci://docker.io/huugoocm/betsphere-compose:dev up -d
```

Para consultar el estado, los logs o detener esta instalación, utiliza `dev` como etiqueta en los comandos de las secciones siguientes.

## Última release publicada

Cuando haya una release publicada, utiliza `latest` para arrancar la más reciente:

```sh
docker compose -p betsphere --env-file .env -f oci://docker.io/huugoocm/betsphere-compose:latest up -d
```

Consulta los [tags disponibles](https://hub.docker.com/r/huugoocm/betsphere-compose/tags). El tag `latest` requiere que se haya publicado una release; `dev` identifica una build de desarrollo. Consulta la [publicación de versiones](development-guide.md#publicación-de-una-release-de-github) para conocer el procedimiento de entrega.

Comprueba el estado y los logs:

```sh
docker compose -p betsphere --env-file .env -f oci://docker.io/huugoocm/betsphere-compose:latest ps -a
docker compose -p betsphere --env-file .env -f oci://docker.io/huugoocm/betsphere-compose:latest logs --tail=100 app
```

MySQL y MinIO deben estar saludables y `minio-init` debe finalizar con código `0`. Cuando la aplicación termine de arrancar, abre [https://localhost/](https://localhost/) o [https://localhost/login](https://localhost/login). El navegador puede advertir de que el certificado de demostración no procede de una autoridad de confianza.

## Versión específica

Sustituye `latest` por el tag publicado elegido en todos los comandos. Para la entrega 0.1, una vez publicada:

```sh
docker compose -p betsphere --env-file .env -f oci://docker.io/huugoocm/betsphere-compose:0.1 up -d
```

Conserva el mismo nombre de proyecto para reutilizar sus volúmenes. Antes de cambiar de versión, comprueba la compatibilidad del esquema y guarda copias de seguridad.

## Datos y cuentas de ejemplo

El inicializador de la aplicación está activado por defecto. En una base vacía crea tres deportes, cinco competiciones, doce equipos o participantes y siete partidos programados, cuyas fechas se calculan respecto al arranque que los crea.

| Deporte | Competiciones |
| --- | --- |
| Football | Premier League, La Liga y Bundesliga. |
| Basketball | EuroLeague. |
| Tennis | ATP Tour. |

Incluye encuentros como Manchester City–Arsenal, Real Madrid–Barcelona, ALBA Berlin–Olympiacos y Rafael Nadal–Carlos Alcaraz. Si la tabla de usuarios está vacía, crea estas cuentas:

| Perfil | Correo de acceso | Contraseña |
| --- | --- | --- |
| Administrador | `admin@betsphere.com` | `admin123` |
| Usuario registrado | `user@betsphere.com` | `user123` |

El catálogo incluye 20 imágenes de demostración creadas para BetSphere. Hay tres iconos de deportes, cinco distintivos de competiciones y doce de equipos o participantes. El inicializador guarda los PNG en MinIO y sus URLs en MySQL. Si se reinicia la aplicación, vuelve a usar los mismos identificadores y conserva las imágenes personalizadas. Consulta los [créditos de las imágenes](../backend/src/main/resources/demo-images/CREDITS.md).

El inicializador añade los ejemplos que falten, así que un ejemplo eliminado puede reaparecer en un arranque posterior mientras siga activo. Consulta las [funcionalidades disponibles](functionalities.md).

## Arranque sin cargar ejemplos ni modificar el esquema

El Compose original no transmite una variable para desactivar el inicializador. Spring Boot sí acepta esa opción como argumento de arranque, por lo que se puede ejecutar el mismo servicio con argumentos adicionales, sin cambiar el YAML.

Si `app` ya está en ejecución, detén ese servicio para liberar el puerto `443`:

```sh
docker compose -p betsphere --env-file .env -f oci://docker.io/huugoocm/betsphere-compose:latest stop app
```

Después ejecuta:

```sh
docker compose -p betsphere --env-file .env -f oci://docker.io/huugoocm/betsphere-compose:latest run --rm --service-ports app --betsphere.seeder.enabled=false --spring.jpa.hibernate.ddl-auto=validate
```

Este comando utiliza la misma imagen, red y base de datos, desactiva el inicializador y valida el esquema sin modificarlo. La base debe existir y ser compatible. La aplicación queda en primer plano; `Ctrl+C` la detiene y elimina únicamente ese contenedor temporal. Las dependencias y los volúmenes permanecen. Utiliza este comando en cada arranque que deba conservar los datos sin recargar ejemplos. El comando habitual `up -d` mantiene la carga de ejemplos activada.

## Persistencia

Con `-p betsphere`, los datos se guardan en `betsphere_mysql_prod_data` y las imágenes en `betsphere_minio_prod_data`. Mantén el nombre del proyecto, el bucket y las credenciales originales. Cambiar `DB_PASSWORD` en `.env` no cambia la contraseña de una base ya inicializada.

Para retirar los contenedores conservando los datos:

```sh
docker compose -p betsphere --env-file .env -f oci://docker.io/huugoocm/betsphere-compose:latest down
```

**Añadir `--volumes` a `down` elimina los datos e imágenes de esa instalación.** Úsalo únicamente si quieres descartar ese entorno. Los volúmenes no sustituyen una copia de seguridad.

## Despliegue en un servidor externo

Para un servidor de evaluación, prepara una VM Linux con Docker Engine y Compose siguiendo las instrucciones oficiales anteriores.

1. Copia al servidor la configuración `.env` necesaria, con credenciales propias para la base de datos y MinIO y las contraseñas correspondientes al certificado de la imagen. No es necesario copiar el código ni el Compose.
2. Permite TCP `443` en el firewall y en las reglas de red del proveedor. Mantén `9000` y `9001` bloqueados desde Internet, pues el Compose original publica esos puertos para MinIO. MySQL utiliza la red interna de Docker.
3. Ejecuta el comando OCI de la versión específica elegida y revisa sus logs. Para conservar una base existente sin cargar ejemplos, utiliza el comando de la sección anterior.
4. Accede desde otro equipo a `https://<IP-o-dominio-del-servidor>/` y comprueba el catálogo y el acceso con las cuentas del entorno de evaluación. El certificado incluido es de demostración y puede generar avisos de confianza y de nombre de dominio.
5. Mantén copias de seguridad de MySQL, MinIO y la configuración. Una publicación para usuarios reales requiere un certificado válido para su dominio y sustituir las credenciales de demostración.

## Comprobaciones realizadas

El 24 de noviembre de 2026 se confirmaron manualmente estas pruebas en Windows con Docker Desktop, el artefacto OCI `huugoocm/betsphere-compose:dev`, el proyecto de prueba `betsphere-check` y un `.env` local:

- Arranque de los servicios y acceso a la aplicación desde `https://localhost/`.
- Creación de un deporte y conservación del registro tras detener `app` y arrancarlo con `--betsphere.seeder.enabled=false --spring.jpa.hibernate.ddl-auto=validate`.

Estas comprobaciones utilizan configuración local privada; no validan todavía el ejemplo público con los marcadores del keystore. Quedan pendientes la comprobación de imágenes subidas, los tags de release `latest` y una versión específica, y el despliegue en un servidor externo.
