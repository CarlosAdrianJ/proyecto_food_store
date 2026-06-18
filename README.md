# Food Store — Sistema de Gestión de Pedidos

Aplicación full stack para la gestión de categorías, productos, usuarios y pedidos de una tienda de comida.

| Componente | Tecnología |
|------------|------------|
| Backend | Java 21, Spring Boot 3.5, Spring Data JPA, MySQL |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| API Docs | SpringDoc OpenAPI (Swagger UI) |

---

## Enlaces obligatorios de entrega

### Video demostrativo

> El video debe tener **permisos públicos** de visualización (YouTube, Google Drive, etc.).

**[Ver video demostrativo del proyecto](https://www.youtube.com/watch?v=REEMPLAZAR_CON_TU_VIDEO)**

> Reemplazá `REEMPLAZAR_CON_TU_VIDEO` por el ID o enlace real de tu video antes de entregar.

### Documentación en PDF

La documentación técnica del proyecto está disponible en la raíz del repositorio:

- [Descargar documentación (PDF)](./documentacion.pdf)

> Si preferís alojar el PDF externamente, reemplazá el enlace anterior por la URL pública del archivo.

---

## Requisitos previos

Instalá las siguientes herramientas antes de comenzar:

| Herramienta | Versión recomendada |
|-------------|---------------------|
| [Java JDK](https://adoptium.net/) | 21 |
| [MySQL Server](https://dev.mysql.com/downloads/mysql/) | 8.x |
| [Node.js](https://nodejs.org/) | 20 LTS o superior |
| npm | Incluido con Node.js |

Verificá las instalaciones:

```bash
java -version
mysql --version
node -v
npm -v
```

---

## Estructura del proyecto

```
.
├── README.md
├── documentacion.pdf          # Documentación técnica (entrega obligatoria)
├── backend/backend/           # API REST (Spring Boot)
└── frontend/frontend/         # Interfaz web (React + Vite)
```

---

## Configuración de la base de datos

El backend utiliza **MySQL**. Los valores por defecto están en `backend/backend/src/main/resources/application.properties`.

### 1. Crear la base de datos y el usuario

Conectate a MySQL como administrador y ejecutá:

```sql
CREATE DATABASE IF NOT EXISTS foodstore_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'foodstore_user'@'localhost' IDENTIFIED BY 'carlos1234';

GRANT ALL PRIVILEGES ON foodstore_db.* TO 'foodstore_user'@'localhost';

FLUSH PRIVILEGES;
```

### 2. Verificar la configuración del backend

Archivo: `backend/backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/foodstore_db
spring.datasource.username=foodstore_user
spring.datasource.password=carlos1234

spring.jpa.hibernate.ddl-auto=update
```

| Parámetro | Valor por defecto | Descripción |
|-----------|-------------------|-------------|
| Base de datos | `foodstore_db` | Nombre del schema MySQL |
| Usuario | `foodstore_user` | Usuario de conexión |
| Contraseña | `carlos1234` | Contraseña del usuario |
| Puerto MySQL | `3306` | Puerto del servidor MySQL |
| `ddl-auto` | `update` | Hibernate crea/actualiza tablas automáticamente |

> Si usás otro usuario, contraseña o puerto, modificá `application.properties` antes de iniciar el backend.

### 3. Usuario administrador inicial

Al primer arranque, si la base está vacía, se crea automáticamente un administrador:

| Campo | Valor |
|-------|-------|
| Email | `admin@foodstore.com` |
| Contraseña | `Admin1234` |

Estos valores se configuran en las propiedades `app.admin.*` del mismo archivo `application.properties`.

---

## Instalación

### Backend

Desde la raíz del repositorio:

```bash
cd backend/backend
```

En **Windows**:

```powershell
.\gradlew.bat build
```

En **Linux / macOS**:

```bash
./gradlew build
```

### Frontend

```bash
cd frontend/frontend
npm install
```

---

## Ejecución del proyecto

Levantá **primero el backend** y luego el frontend. Usá dos terminales.

### Terminal 1 — Backend (puerto 8080)

```bash
cd backend/backend
```

**Windows:**

```powershell
.\gradlew.bat bootRun
```

**Linux / macOS:**

```bash
./gradlew bootRun
```

El servidor estará disponible en: `http://localhost:8080`

### Terminal 2 — Frontend (puerto 5173)

```bash
cd frontend/frontend
npm run dev
```

La aplicación web estará disponible en: `http://localhost:5173`

---

## URLs de acceso

| Recurso | URL |
|---------|-----|
| Aplicación web | http://localhost:5173 |
| API REST | http://localhost:8080/api |
| Swagger UI (documentación interactiva) | http://localhost:8080/swagger-ui/index.html |
| OpenAPI JSON | http://localhost:8080/api-docs |

### Endpoints principales

| Módulo | Base URL |
|--------|----------|
| Autenticación | `http://localhost:8080/api/auth` |
| Categorías | `http://localhost:8080/api/categories` |
| Usuarios | `http://localhost:8080/api/users` |
| Productos | `http://localhost:8080/api/products` |
| Pedidos | `http://localhost:8080/api/orders` |

---

## Comandos útiles

### Backend

| Comando | Descripción |
|---------|-------------|
| `.\gradlew.bat bootRun` | Inicia el servidor en modo desarrollo (Windows) |
| `./gradlew bootRun` | Inicia el servidor en modo desarrollo (Linux/macOS) |
| `.\gradlew.bat test` | Ejecuta los tests unitarios |
| `.\gradlew.bat build` | Compila y empaqueta el proyecto |

### Frontend

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Compila para producción |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta el linter |

---

## Prueba rápida del sistema

1. Asegurate de que MySQL esté en ejecución y la base `foodstore_db` creada.
2. Iniciá el backend con `gradlew bootRun`.
3. Iniciá el frontend con `npm run dev`.
4. Abrí `http://localhost:5173` en el navegador.
5. Iniciá sesión con `admin@foodstore.com` / `Admin1234`.
6. Verificá el CRUD de categorías, productos, usuarios y pedidos.
7. Consultá la API en Swagger: `http://localhost:8080/swagger-ui/index.html`.

---

## Solución de problemas

| Problema | Posible solución |
|----------|------------------|
| Error de conexión a MySQL | Verificá que el servicio MySQL esté activo y que usuario/contraseña coincidan con `application.properties`. |
| Puerto 8080 en uso | Detené el proceso que ocupa el puerto o cambiá `server.port` en `application.properties`. |
| Puerto 5173 en uso | Vite usará el siguiente puerto disponible; revisá la salida de la terminal. |
| CORS bloqueado | El backend permite `http://localhost:5173`. Si usás otro puerto, agregalo en `CorsConfig.java`. |
| Frontend no conecta con la API | Confirmá que el backend esté corriendo en `http://localhost:8080`. |

---

## Autor

Proyecto desarrollado como Trabajo Práctico Integrador — Programación III.
