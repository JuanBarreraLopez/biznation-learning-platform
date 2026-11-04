# Modelo de Base de Datos y Relaciones

El sistema utiliza PostgreSQL gestionado a través de Sequelize ORM. Todas las tablas principales utilizan `UUIDv4` como clave primaria para mayor seguridad y escalabilidad.

## Entidades Principales
* **Users:** Almacena credenciales (hash bcrypt) y el rol (`admin` o `student`).
* **Courses:** Representa un curso. Tiene relación 1:N con Users (creador) y soporta _Soft Delete_ (`deletedAt`).
* **Lessons:** Contenido de los cursos. Relación N:1 con Courses.
* **Enrollments (Matrículas):** Tabla pivote entre Users y Courses. Posee un índice `UNIQUE(user_id, course_id)` para impedir que un estudiante se matricule dos veces en el mismo curso.
* **LessonProgress:** Registra qué estudiante completó qué lección.
* **WebhookEvents:** Almacena payloads en formato `JSONB` para consultas rápidas, con `UNIQUE(event_id)` para idempotencia.
* **Classifications:** Guarda el resultado del motor de reglas automatizado (ej. `at_risk`).

## Regla Crítica de Integridad
Se implementó una validación a nivel de controlador que impide ejecutar el _Soft Delete_ de un curso si existe al menos un registro activo en la tabla `Enrollments` para dicho curso, respondiendo con un `HTTP 409 Conflict`.