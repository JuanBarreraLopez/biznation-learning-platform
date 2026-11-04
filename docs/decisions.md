# Registro de Decisiones Técnicas (ADR)

## 1. Arquitectura: Monolito Modular vs Microservicios
* **Decisión:** Se implementó un Monolito Modular en Node.js/Express.
* **Justificación:** El alcance de la prueba y el tiempo de entrega no justifican la complejidad operativa de los microservicios. Separar el código en módulos (`auth`, `courses`, `webhooks`) permite mantener el código ordenado y facilita una futura extracción a microservicios si el negocio lo requiere.

## 2. Recepción de Webhooks e Idempotencia
* **Decisión:** Uso de restricción `UNIQUE(event_id)` en la base de datos PostgreSQL.
* **Justificación:** Los proveedores externos (ej. Meta/WhatsApp) pueden reintentar enviar un webhook si hay latencia. Al delegar la restricción de unicidad a la base de datos, aseguramos la idempotencia y evitamos procesar un mismo evento (o pago) dos veces, respondiendo un 200 OK al proveedor para detener los reintentos.

## 3. Automatización de Estudiantes "En Riesgo"
* **Decisión:** Implementación de un motor de reglas determinístico (Cron Job) en lugar de un modelo de IA externo.
* **Justificación:** Para clasificar a un estudiante en riesgo por inactividad o bajo avance, las reglas de negocio precisas son más rápidas, auditables y económicas que consultar un LLM o entrenar un modelo predictivo, cumpliendo con el requerimiento funcional de automatización sin sobre-ingeniería.

## 4. Cálculo del Progreso
* **Decisión:** El progreso del curso se calcula dinámicamente (`lecciones completadas / lecciones publicadas`).
* **Justificación:** Evita la inconsistencia de datos que ocurre al intentar mantener un campo de porcentaje estático actualizado en múltiples tablas.