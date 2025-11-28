## Arquitectura general

ZeroFoodWaste está basada en una arquitectura cliente-servidor con API REST.

- **Frontend**
  - SPA desarrollada con **React** (JavaScript).
  - Consume la API REST del backend mediante peticiones HTTP (JSON).
  - Diferenciación de vistas según rol:
    - Establecimiento: creación y gestión de donaciones.
    - Banco de alimentos: visualización de donaciones, aceptación y seguimiento.

- **Backend**
  - API REST desarrollada con **Java + Spring Boot**.
  - Expone endpoints para autenticación, gestión de usuarios y donaciones.
  - Implementa la lógica de negocio (validaciones, estados de las donaciones, roles).

- **Base de datos**
  - **MySQL** como motor de base de datos relacional.
  - Gestión de usuarios, donaciones y estados.
  
- **Comunicación**
  - Formato de intercambio: **JSON**.
  - Protocolo: HTTP.
  - Arquitectura orientada a recursos vía endpoints `/api/...`.

---

## Modelo de datos (resumen)

Entidades principales:

- **User**
  - `id` (PK)
  - `name`
  - `email`
  - `password`
  - `role` (`ESTABLISHMENT` / `FOODBANK`)
  
- **Donation**
  - `id` (PK)
  - `title`
  - `description`
  - `quantity`
  - `expirationDate`
  - `status` (`PENDING`, `ACCEPTED`, `PICKED_UP`)
  - `createdAt`
  - `establishment_id` (FK → User)

- **Pickup** (opcional, según Hito3)
  - `id` (PK)
  - `donation_id` (FK → Donation)
  - `foodbank_id` (FK → User)
  - `pickupDate`
  - `notes`

Relaciones:

- Un **User (establecimiento)** puede crear muchas **Donations**.
- Un **User (banco de alimentos)** puede aceptar/recoger muchas **Donations**.
- Una **Donation** puede estar asociada a un registro de **Pickup**.

---

## Estructura de la API (resumen MVP)

| Método | Endpoint                     | Descripción                                      | Rol principal         |
|--------|------------------------------|--------------------------------------------------|-----------------------|
| POST   | `/api/auth/register`         | Registrar usuario (establecimiento o banco)      | Público               |
| POST   | `/api/auth/login`            | Iniciar sesión y obtener token/sesión            | Público               |
| GET    | `/api/donations`             | Listar donaciones (filtrable por estado)         | Banco / Establecimiento |
| POST   | `/api/donations`             | Crear una nueva donación                         | Establecimiento       |
| GET    | `/api/donations/mine`        | Listar donaciones del establecimiento actual     | Establecimiento       |
| POST   | `/api/donations/{id}/accept` | Aceptar una donación (reservar)                  | Banco de alimentos    |
| POST   | `/api/donations/{id}/picked-up` | Marcar donación como recogida                  | Banco de alimentos    |



---

## Historias seleccionadas para Sprint 1

Para el Sprint 1, el equipo se centrará en implementar el núcleo del MVP:

- **HU-01 – Registro de usuario**  
  Como usuario, quiero registrarme como establecimiento o banco de alimentos para poder usar la plataforma.

- **HU-02 – Login**  
  Como usuario registrado, quiero iniciar sesión para acceder a mi panel.

- **HU-03 – Crear donación**  
  Como establecimiento, quiero publicar una donación con nombre, cantidad y fecha de caducidad para ofrecer mis excedentes.

Estas tres historias permiten que la plataforma ya tenga usuarios registrados y donaciones creadas, base necesaria para el resto de funcionalidades.

---

## Tareas técnicas derivadas (Sprint 1)

### HU-01 – Registro de usuario

- **T-01** – Diseñar formulario de registro en frontend (campos + selección de rol).
- **T-02** – Crear modelo `User` y repositorio JPA en el backend.
- **T-03** – Implementar endpoint `POST /api/auth/register`.
- **T-04** – Validar email único y formato de contraseña en backend.
- **T-05** – Conectar formulario de React con el endpoint de registro.
- **T-06** – Mostrar mensajes de error y éxito en la interfaz.

### HU-02 – Login

- **T-07** – Diseñar formulario de login en frontend.
- **T-08** – Implementar endpoint `POST /api/auth/login` en backend.
- **T-09** – Implementar verificación de credenciales y respuesta apropiada.
- **T-10** – Guardar sesión/token en frontend (estado global / localStorage).
- **T-11** – Redirigir a dashboard según rol después de login correcto.
- **T-12** – Mostrar errores de login (credenciales incorrectas, etc.).

### HU-03 – Crear donación

- **T-13** – Crear entidad `Donation` y repositorio JPA.
- **T-14** – Implementar `DonationService` con validaciones (campos obligatorios, fecha).
- **T-15** – Implementar endpoint `POST /api/donations`.
- **T-16** – Crear componente React `CreateDonationForm`.
- **T-17** – Conectar formulario con backend usando `fetch` o `axios`.
- **T-18** – Validar datos en frontend (cantidad positiva, fecha futura).
- **T-19** – Realizar pruebas manuales del flujo de creación de donaciones.

---

## Tablero Kanban

El equipo utiliza un tablero Kanban con las columnas:

- **To Do**
- **En progreso**
- **En revisión**
- **Hecho**

Ejemplo de estado inicial del Sprint 1:

- **To Do**
  - T-01, T-02, T-03, T-04, T-07, T-08, T-13, T-14, T-16
- **En progreso**
  - T-01 – Diseño formulario de registro
- **En revisión**
  - *(vacío inicialmente)*
- **Hecho**
  - *(se irán moviendo las tareas completadas durante el sprint)*

---

## Repositorio GitHub y estructura inicial

Repositorio creado en GitHub:

- **URL:** `https://github.com/PabloEstebanMartin10/ZeroFoodWaste.git`

Estructura inicial:

```bash
zerofoodwaste/
│
├── frontend/                  # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
│
├── backend/                   # API REST con Spring Boot
│   ├── src/main/java/com/zerofoodwaste/
│   └── pom.xml
│
├── docs/     
│   ├── Hito2-wireframes.md                    
│   ├── Hito3-api-datos.md
│   └── zerofoodwaste-preparacion-proyecto.md
│
└── README.md
```

## Scripts iniciales:

```bash
cd frontend
npm install
npm run dev   # o npm start según configuración

cd backend
mvn spring-boot:run
```

Configuración Application.properties:

```bash
spring.datasource.url=jdbc:mysql://localhost:3306/zerofoodwaste
spring.datasource.username=root
spring.datasource.password=tu_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```