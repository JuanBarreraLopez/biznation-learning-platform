# Arquitectura del Sistema

El sistema sigue un patrón de diseño basado en capas dentro de un monolito modular.

## Flujo de una Petición (Request Lifecycle)
1. **Cliente (Angular):** Envía la petición HTTP con el JWT en el header `Authorization: Bearer <token>`.
2. **Router (Express):** Recibe la petición y la enruta al módulo correspondiente.
3. **Middlewares de Seguridad:**
   * `authenticate`: Verifica la validez y firma del JWT.
   * `authorize`: Verifica que el rol del usuario (ej. `admin`) tenga permisos para la ruta.
4. **Controlador:** Recibe los datos validados, extrae los parámetros y delega la ejecución al servicio o modelo.
5. **Modelo (Sequelize/PostgreSQL):** Ejecuta la consulta SQL parametrizada, aplicando reglas de integridad y _soft deletes_.
6. **Respuesta:** El controlador formatea la salida en JSON y retorna el código HTTP adecuado (ej. 200 OK, 404 Not Found, 409 Conflict).