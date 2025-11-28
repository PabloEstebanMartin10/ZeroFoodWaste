# Documentación de ZeroFoodWaste

De la idea al prototipo: Hito 1  

---

## Sprint 0 – Visión y alineación

### 1. Contexto general del equipo

El equipo está compuesto por cuatro alumnos del Bootcamp:

- **Mickael** – desarrollo frontend con React + JavaScript, maquetación y consumo de API REST.
- **Ignacio** – desarrollo backend con Java + Spring Boot, diseño de API.
- **Cynthia** – coordinación, documentación (Notion, Markdown, .docx), apoyo a pruebas y UX.
- **Pablo E.** – bases de datos (MySQL), modelo de datos y apoyo a backend.

> **Roles Scrum (pendiente formalizar):**
> - Product Owner: (propuesta: Cynthia o Ignacio).
> - Scrum Master: (propuesta: Ignacio o Pablo).
> - Dev Team: el resto del equipo, con especialización frontend / backend / BD.

El grupo trabajará de forma ágil utilizando **Scrum**, con:

- Reunión rápida al inicio de cada sesión (daily corta).
- Revisión de sprint y retrospectiva al final de cada iteración.
- Uso de un tablero Kanban en GitHub Projects u otra herramienta similar.

---

### 2. Definición del problema y motivación inicial

Durante la lluvia de ideas, el equipo detectó una problemática clara:

- Se desperdician **toneladas de comida** en restaurantes y supermercados.
- Los bancos de alimentos **no tienen visibilidad en tiempo real** de los excedentes.
- La coordinación manual (llamadas, correos, acuerdos puntuales) es **lenta, ineficiente** y provoca que alimentos aún aptos acaben en la basura.

**Declaración del problema**

> “Los establecimientos de alimentación con excedentes no disponen de una plataforma centralizada y sencilla que permita publicar donaciones de comida y conectarlas con bancos de alimentos en tiempo real, lo que provoca un gran desperdicio de alimentos aprovechables.”

Motivación:

- Reducir el desperdicio alimentario.
- Apoyar los **Objetivos de Desarrollo Sostenible 2030** (especialmente ODS 2 y ODS 12).
- Digitalizar un proceso que hoy es manual, mejorando la coordinación y generando datos útiles.

---

### 3. Visión del producto

**Visión de ZeroFoodWaste**

> “Queremos conectar establecimientos de alimentación con excedentes (restaurantes, supermercados, comercios) con bancos de alimentos, permitiendo publicar, localizar y reservar donaciones de comida de forma rápida y trazable, para reducir el desperdicio alimentario y facilitar la redistribución solidaria de alimentos.”

**Público objetivo**

- **Donantes:** restaurantes, supermercados y comercios que generan excedentes o productos próximos a caducar.
- **Receptores:** bancos de alimentos y entidades sociales que recogen y distribuyen la comida.

**¿Por qué nuestra solución?**

- Digitaliza un proceso que actualmente es manual y desorganizado.
- Ofrece **datos, métricas y reportes** (en versiones futuras).
- Utiliza tecnología **sencilla y accesible** (React, Spring Boot, MySQL, API REST).
- Interfaz ligera, clara y usable, centrada en las tareas clave: **publicar, ver, reservar y recoger**.

---

### 4. Roles y responsabilidades

| Rol                       | Integrante (propuesto) | Responsabilidades principales                                                                 |
|---------------------------|------------------------|-----------------------------------------------------------------------------------------------|
| Product Owner             | *Pendiente asignar*    | Define la visión del producto, prioriza el backlog, valida el cumplimiento del MVP.           |
| Scrum Master              | *Pendiente asignar*    | Facilita reuniones, elimina bloqueos, vela por la metodología Scrum.                          |
| Desarrollador Frontend    | Mickael                | Implementa la SPA en React, diseña componentes y consume la API.                              |
| Desarrollador Backend     | Ignacio                | Implementa la API REST en Spring Boot, lógica de negocio y validaciones.                      |
| Responsable de Base de Datos | Pablo E.           | Modelo de datos en MySQL, relaciones entre entidades, rendimiento básico.                     |
| Documentación / QA        | Cynthia                | Documentación en Notion, .docx y Markdown; apoyo a pruebas funcionales.                       |

Acuerdos internos:

- Reunión de sincronización al inicio de cada clase (10–15 min).
- Nadie sube cambios a `main` sin **pull request** y revisión.
- Commits descriptivos y ramas por feature (`feature/auth`, `feature/donations`, etc.).

---

### 5. Herramientas y canales de comunicación

| Propósito                | Herramienta elegida                          |
|--------------------------|----------------------------------------------|
| Control de versiones     | GitHub (repositorio compartido)              |
| Comunicación diaria      | (Discord / WhatsApp / Teams – a concretar)   |
| Diseño y notas rápidas   | Notion                                       |
| Documentos de apoyo      | OneDrive (.docx)                             |
| Documentación técnica    | Markdown en `/docs` (GitHub)                 |
| Gestión de tareas        | GitHub Projects (tablero Kanban)             |

**Documentos origen:**

- Notion: problema, solución, visión general y MoSCoW.
- Document1 (OneDrive): Wireframes, flujo de usuario y entidades de datos. :contentReference[oaicite:0]{index=0}  
- Hito3.md: definición de datos, API y parte de las historias de usuario. :contentReference[oaicite:1]{index=1}  

> **Pendiente:** dejar los enlaces reales a Notion/OneDrive en el README o en un doc interno (si queréis).

---

### 6. Documento de visión consolidado

**Nombre del proyecto:** ZeroFoodWaste  

**Descripción corta:**  
Aplicación web que conecta establecimientos de alimentación con excedentes con bancos de alimentos, permitiendo gestionar donaciones (publicación, reserva y recogida) para reducir la comida desperdiciada.

**Objetivo principal:**  
Reducir el desperdicio alimentario y facilitar la redistribución solidaria de comida mediante una plataforma sencilla y trazable.

**Tecnologías:**

- **Frontend:** React + JavaScript.
- **Backend:** Java + Spring Boot (API REST).
- **Base de datos:** MySQL.
- **Otros:** Spring Data JPA, Spring Web, validación, posible Spring Security en el futuro.

**Duración estimada:** 4–5 semanas (visión, diseño funcional, modelo de datos, MVP, pruebas y demo).

---

## Sprint 1 – Problema, propuesta y MVP

### 1. Problemas detectados

- Toneladas de comida se desperdician cada día en restaurantes y supermercados.
- Los bancos de alimentos no ven en tiempo real qué excedentes hay disponibles.
- La coordinación manual (llamadas, correos) es lenta, propensa a errores y genera pérdida de alimentos.
- No hay trazabilidad clara del ciclo **donación → aceptación → recogida**.

**Declaración del problema**

> “Establecimientos y bancos de alimentos carecen de una herramienta digital para coordinar excedentes de comida, lo que provoca desperdicio de alimentos y procesos logísticos confusos.”

---

### 2. Propuesta de valor

> “Una plataforma web que conecta automáticamente a donantes (restaurantes, supermercados, comercios) con bancos de alimentos, permitiendo la publicación rápida de excedentes, notificaciones básicas y gestión del estado de las donaciones hasta su recogida.”

Desglose:

- **Usuario donante (establecimiento):** publicar excedentes de manera rápida.
- **Usuario receptor (banco):** ver donaciones pendientes, filtrarlas y aceptarlas.
- **Resultado:** menos comida a la basura, más recursos para entidades sociales y datos para mejorar el proceso.

---

### 3. Tabla MoSCoW (alcance del producto)

#### Must have

- Registro e inicio de sesión de usuarios (restaurantes, supermercados, bancos).
- Gestión de perfiles (datos básicos del establecimiento / banco).
- Publicación de excedentes (nombre del producto, cantidad, fecha de caducidad, foto opcional).
- Listado de donaciones activas visible para los bancos de alimentos.
- Notificaciones o alertas básicas cuando se crea un nuevo excedente.
- Reserva/aceptación de una donación por parte del banco de alimentos.
- Estado de la donación (**pendiente → aceptada → recogida**).
- Backend con API REST en Spring Boot + base de datos.
- Autorización por roles (establecimiento vs banco).

#### Should have

- Filtros/búsquedas de donaciones (tipo de alimento, ubicación, fecha).
- Ubicación en mapa de las donaciones y de los bancos.
- Chat o mensajería interna básica para coordinar detalles de la recogida.
- Historial de donaciones realizadas.
- Panel de administración para revisar usuarios y datos.
- Perfil ampliado para cada establecimiento (horarios, instrucciones de recogida).
- Sistema de notificaciones por email o push.

#### Could have

- Estadísticas y dashboards de toneladas rescatadas, CO₂ ahorrado, etc.
- Sistema de valoración entre bancos y establecimientos.
- Automatización de recogidas con rutas recomendadas.
- Integración con APIs de mapas más avanzadas (Google Maps, OpenStreetMap).
- Modo oscuro / personalización del tema visual.
- Generación de informes descargables (PDF/Excel).
- Multilenguaje (ES/EN/CAT, etc).

#### Won’t have (por ahora)

- App móvil nativa (Android/iOS).
- Integración con sistemas internos de inventario de supermercados.
- Algoritmos predictivos de excedentes usando IA.
- Sistema avanzado de logística con conductores y seguimiento GPS en vivo.
- Pagos o incentivos económicos dentro de la plataforma.

---

### 4. Definición del MVP

El MVP se centra en cubrir todo lo **Must have**:

1. Registro y login para dos tipos de usuarios:
   - **Establecimiento**
   - **Banco de alimentos**
2. Panel (dashboard) según rol:
   - Establecimiento: crear y gestionar donaciones.
   - Banco: ver donaciones pendientes, aceptarlas y marcarlas como recogidas.
3. Estados de una donación:
   - `PENDING` → `ACCEPTED` → `PICKED_UP`
4. Notificaciones básicas:
   - Al establecimiento cuando un banco acepta su donación.
   - Al banco cuando su donación cambia de estado (opcional en MVP o como Should have).
5. API REST en Spring Boot + MySQL con modelo de datos básico.

---

## Sprint 2 – Experiencia de usuario y diseño funcional  
*(wireframes + flujo de usuario) - Hito 2*


### 1. Wireframes: pantallas mínimas del MVP

Se definen las pantallas principales:

1. **Homepage**
   - Breve explicación de la plataforma.
   - CTA: “Iniciar sesión” / “Registrarse”.
2. **Pantalla de login / registro**
   - Login de usuario: email + contraseña.
   - Registro: seleccionar rol (Establecimiento / Banco de alimentos) + datos básicos.
3. **Dashboard establecimiento**
   - Listado de donaciones creadas por el establecimiento.
   - Botón “Crear nueva donación”.
   - Columna con estado: Pendiente / Aceptada / Recogida.
4. **Formulario: Crear donación**
   - Campos: nombre del producto,descripción(opcional),  cantidad, fecha de caducidad, foto opcional.
   - Botón “Publicar donación”.
5. **Vista/detalle de donación**
   - Información completa del producto.
   - Estado actual.
   - Para establecimiento: ver qué banco la aceptó y cuándo.
   - Para banco: botón “Aceptar donación” o “Marcar como recogida”.
6. **Dashboard banco de alimentos**
   - Listado de donaciones en estado `PENDING` (pendientes).
   - Filtros por fecha de caducidad / tipo / ubicación (Should have).
   - Separación visual de “Donaciones aceptadas” y “Historial”.
7. **Historial de donaciones (banco)**
   - Listado de donaciones aceptadas y recogidas por ese banco.
8. **Pantalla de perfil (común, con campos distintos según rol)**
   - Establecimiento: nombre, dirección, teléfono, horario de apertura.
   - Banco: nombre, dirección, teléfono, zona de cobertura.



---

### 2. Flujo de usuario – Establecimiento

1. Usuario entra → Pantalla de login / registro.
2. Se registra como “Establecimiento”.
3. Inicia sesión.
4. Accede al **Dashboard establecimiento**.
5. Pulsa “Crear nueva donación”.
6. Rellena el formulario y publica la donación.
7. Vuelve al dashboard y ve su donación en estado **“Pendiente”**.
8. Cuando un banco la acepta, recibe una notificación.
9. En el detalle ve el estado **“Aceptada”** y qué banco la recogerá.
10. Tras la recogida, la donación aparece como **“Recogida”** en el listado/historial.

---

### 3. Flujo de usuario – Banco de alimentos

1. Usuario entra → Pantalla de login / registro.
2. Se registra como “Banco de alimentos”.
3. Inicia sesión.
4. Accede al **Dashboard banco** con listado de donaciones pendientes.
5. Filtra / ordena por fecha de caducidad (cuando esté implementado).
6. Entra al detalle de una donación y pulsa **“Aceptar”**.
7. La donación pasa a estado **“Aceptada”** y aparece en la sección “Donaciones aceptadas”.
8. Una vez recogida físicamente, entra de nuevo al detalle y pulsa **“Marcar como recogida”**.
9. La donación aparece en el **historial** como “Recogida”.

---

### 4. Validación del flujo

El flujo cubre:

- El ciclo completo desde el registro hasta la recogida de donaciones.
- Dos recorridos diferenciados (Establecimiento / Banco).
- Estados claros de la donación: `PENDING`, `ACCEPTED`, `PICKED_UP`.

> **Pendiente para siguientes sprints:** añadir estados de error, mensajes de validación y pantallas de “no hay donaciones disponibles”, etc.

---

## Sprint 3 – Datos, API y modelo técnico
 

### 1. Entidades principales

#### Entidad: User

- `id`
- `email`
- `passwordHash`
- `role` (ENUM: `ESTABLECIMIENTO`, `BANCO`)
- Relación 1–1 con `Establishment` o `FoodBank`, según el rol.

#### Entidad: Establishment

- `id`
- `user_id` (FK a User)
- `name`
- `address`
- `contactPhone`
- `openingHours` (string)

#### Entidad: FoodBank

- `id`
- `user_id` (FK a User)
- `name`
- `address`
- `contactPhone`
- `coverageArea` (string)

#### Entidad: Donation

- `id`
- `establishment_id` (FK a Establishment)
- `productName`
- `quantity`
- `expirationDate`
- `photoUrl` (opcional)
- `status` (ENUM: `PENDING`, `ACCEPTED`, `PICKED_UP`)
- `createdAt`
- `updatedAt`

#### Entidad: DonationAssignment

- `id`
- `donation_id` (FK a Donation)
- `foodbank_id` (FK a FoodBank)
- `acceptedAt`
- `pickedUpAt`

#### Entidad: Notification

- `id`
- `user_id` (FK a User)
- `message`
- `type` (`ACCEPTED_DONATION`, `PICKED_UP_DONATION`, etc.)
- `createdAt`
- `read` (boolean)


---

### 2. Diseño del modelo de datos

Relaciones básicas:

- Un **User** se asocia 1–1 con un **Establishment** o un **FoodBank**.
- Un **Establishment** tiene muchas **Donations**.
- Una **Donation** puede estar asignada a un **FoodBank** mediante `DonationAssignment` (1–1).
- Un **FoodBank** puede tener muchas **DonationAssignment**.
- Un **User** puede tener muchas **Notifications**.


---

### 3. Definición de endpoints (contrato API inicial)

#### Autenticación / usuarios

- **POST** `/auth/register`  
  Registra un nuevo usuario (requiere elegir rol: `ESTABLECIMIENTO` o `BANCO`).

- **POST** `/auth/login`  
  Devuelve los datos básicos del usuario y su rol.  
  (En el MVP puede ser un login sencillo sin JWT avanzado; en futuros sprints se podrá mejorar la seguridad).

#### Establecimientos

- **GET** `/establishments/me`  
  Devuelve los datos del establecimiento del usuario logueado.

- **PUT** `/establishments/me`  
  Actualiza su perfil (dirección, teléfono, horario).

#### Bancos de alimentos

- **GET** `/foodbanks/me`
- **PUT** `/foodbanks/me`

#### Donaciones

- **GET** `/donations`  
  Lista donaciones con filtro opcional por `status=PENDING` (por defecto) y otros (Should have).

- **POST** `/donations`  
  Crear una donación (solo usuarios con rol `ESTABLECIMIENTO`).

- **GET** `/donations/{id}`  
  Ver detalle de una donación.

- **PUT** `/donations/{id}`  
  Editar donación (solo establecimiento propietario, mientras esté en `PENDING`).

- **DELETE** `/donations/{id}`  
  Eliminar donación (opcional según prioridades).

#### Asignación y estados

- **POST** `/donations/{id}/accept`  
  Crea un `DonationAssignment` y cambia estado a `ACCEPTED`. Solo rol `BANCO`.

- **POST** `/donations/{id}/picked-up`  
  Marca donación como `PICKED_UP` y actualiza `pickedUpAt`.

#### Notificaciones (Should have)

- **GET** `/notifications`  
  Lista notificaciones del usuario logueado.

---

### 4. Ejemplos de request / response (ejemplo simplificado)

**Crear donación (POST `/donations`)**

Request:

```json
{
  "productName": "Yogures naturales",
  "quantity": 40,
  "expirationDate": "2025-03-10",
  "photoUrl": "https://example.com/yogures.jpg"
}

Response(201 created)

{
  "id": 15,
  "productName": "Yogures naturales",
  "quantity": 40,
  "expirationDate": "2025-03-10",
  "status": "PENDING",
  "createdAt": "2025-03-05T10:30:00",
  "updatedAt": "2025-03-05T10:30:00"
}

Aceptar donación (POST /donations/15/accept)

{
  "donationId": 15,
  "foodbankId": 3,
  "status": "ACCEPTED",
  "acceptedAt": "2025-03-05T11:00:00"
}

```

## Sprint 4 – Branding y entorno de desarrollo

*FALTA POR HACER*

### 1. Identidad visual (propuesta)

- **Nombre:** ZeroFoodWaste.
- **Estilo:** sencillo, cercano y profesional.

**Paleta de colores (ejemplo):**

- Verde principal (sostenibilidad).
- Naranja / amarillo para alertas (caducidades).
- Gris para fondos neutros.

**Tipografía:**

- Sans-serif legible (por ejemplo, **Inter** / **Roboto**).

> **Pendiente:** definir paleta y tipografías concretas, logotipo y sistema de componentes de diseño (botones, tarjetas, etc.).

---

### 2. Estructura del repositorio

```bash
zerofoodwaste/
│
├── frontend/                        # React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── App.jsx
│   └── package.json
│
├── backend/                         # Spring Boot
│   ├── src/main/java/com/zerofoodwaste/
│   └── pom.xml
│
├── docs/                            # Documentación
│   ├── Hito2-wireframes.md         
│   ├── Hito3.md                 # (actual Hito3.md)
│   └── zerofoodwaste-preparacion-proyecto.md
│
└── README.md

```

## Sprint 5 – Backlog detallado y tareas


### 1. Historias de usuario del MVP

- **HU-01 – Registro de usuario**  
  *Como usuario, quiero registrarme como establecimiento o banco de alimentos para poder usar la plataforma.*

- **HU-02 – Login**  
  *Como usuario registrado, quiero iniciar sesión para acceder a mi panel.*

- **HU-03 – Crear donación**  
  *Como establecimiento, quiero publicar una donación con nombre, cantidad y fecha de caducidad para ofrecer mis excedentes.*

- **HU-04 – Ver donaciones pendientes**  
  *Como banco de alimentos, quiero ver todas las donaciones pendientes para decidir cuáles puedo recoger.*

- **HU-05 – Aceptar donación**  
  *Como banco de alimentos, quiero aceptar una donación para reservarla y organizar su recogida.*

- **HU-06 – Marcar donación como recogida**  
  *Como banco de alimentos (o sistema), quiero marcar una donación como recogida para reflejar que la comida ya ha sido entregada.*

- **HU-07 – Ver estado de mis donaciones**  
  *Como establecimiento, quiero ver el estado de mis donaciones (pendiente, aceptada, recogida) para saber qué ha pasado con cada una.*

---

### 2. Ejemplo de descomposición en tareas técnicas

**HU-03 – Crear donación**

- Crear entidad `Donation` y repositorio JPA.
- Crear `DonationService` con validaciones.
- Implementar endpoint `POST /donations`.
- Crear componente React `CreateDonationForm`.
- Implementar llamada HTTP desde frontend con `fetch` o `axios`.
- Realizar test básico (manual) de creación de donaciones.
