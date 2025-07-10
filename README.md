# 🎓 Sistema de Gestión Académica

Este proyecto es un sistema completo de gestión académica, compuesto por un **backend en Spring Boot** y un **frontend en Angular**. Permite la administración de alumnos, profesores, cursos, salones e inscripciones. Además, incluye seguridad con JWT, filtros personalizados y exportación de datos a Excel.

---

## 📚 Backend - Spring Boot + MySQL

### 🧱 Entidades principales

- **Alumno**: Registro de datos personales del estudiante.
- **Profesor**: Información sobre los docentes.
- **Curso**: Cursos académicos ofertados.
- **Salón**: Aulas o espacios asignados.
- **Inscripción**: Asignación de alumnos a cursos.

### 📋 Listas auxiliares

Entidades referenciales utilizadas en formularios desplegables:

- **Estado**: Activo, Inactivo, etc.
- **Género**: Masculino, Femenino, Otro.
- **Tipo de Salón**: Aula común, Laboratorio, etc.
- **Distrito**: Ubicación geográfica.
- **País**: Nacionalidades.

---

### 🔐 Seguridad

- Autenticación basada en **JWT (JSON Web Token)**.
- Filtros personalizados:
  - `JWTAuthenticationFilter`
  - `JWTAuthorizationFilter`
- Configuración de **CORS** para permitir peticiones desde `http://localhost:4200`.

---

### 📡 Endpoints principales

| Método | Endpoint                  | Descripción                      |
|--------|---------------------------|----------------------------------|
| GET    | /api/alumno/lista         | Lista todos los alumnos          |
| POST   | /api/alumno/crear         | Crea un nuevo alumno             |
| PUT    | /api/alumno/editar/{id}   | Edita un alumno existente        |
| GET    | /api/profesor/lista       | Lista todos los profesores       |
| POST   | /api/inscripcion/crear    | Registra una nueva inscripción   |
| GET    | /api/curso/lista          | Lista todos los cursos           |
| GET    | /api/salon/lista          | Lista todos los salones          |

---

### 🚀 Tecnologías backend

- Java 17+
- Spring Boot
- Spring Data JPA
- Spring Security (JWT)
- Maven
- MySQL

---

## 🖥️ Frontend - Angular

### 🧩 Módulos y Componentes

- **Login** con autenticación vía token.
- **AuthGuard**: Protección de rutas según sesión.
- **Interceptors**: Inserta token en cada petición.
- **Componentes**: Alumnos, Profesores, Cursos, Salones, Inscripciones.
- **Exportación a Excel** usando ExcelJS.

### 🛠️ Funcionalidades

- Formulario reactivo para inscripciones.
- Filtros por alumno, curso, ciclo y profesor.
- Registro, edición y listado de inscripciones.
- Exportar inscripciones filtradas a **Excel**.
- Sidebar dinámico con enlaces a los módulos.
- Modal con Bootstrap para CRUD.

---

### 🛡️ Seguridad frontend

- Se almacena el token JWT en `localStorage`.
- Se valida el token antes de acceder a las rutas protegidas.
- Si no hay sesión, se redirige al login automáticamente.

---

### 📦 Tecnologías frontend

- Angular
- Bootstrap 5
- SweetAlert2
- ExcelJS
- FileSaver.js
- TypeScript
- RxJS

---

## 🔧 Cómo ejecutar localmente

### 📌 Backend

```bash
# Ir a la carpeta del backend
cd backend-gestion-inscripciones

# Ejecutar la app
./mvnw spring-boot:run
