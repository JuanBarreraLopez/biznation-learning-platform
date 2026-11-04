# Propuesta de Arquitectura en AWS

Para cumplir con el requerimiento de infraestructura de Biz Nation, se propone una arquitectura basada en servicios administrados de AWS. Esta decisión prioriza la mantenibilidad, escalabilidad y la reducción de la carga operativa.

## 1. Diagrama Lógico de Servicios

Usuario (Navegador)
  │
  ├──> [Frontend] AWS CloudFront ──> Amazon S3 (Hosting estático Angular)
  │
  └──> [Backend API] AWS App Runner (Contenedores Node.js)
         │
         ├──> [Base de Datos] Amazon RDS for PostgreSQL (Subred Privada)
         ├──> [Seguridad] AWS Secrets Manager (Variables de entorno)
         └──> [Observabilidad] Amazon CloudWatch (Logs y métricas)

## 2. Justificación de Servicios Elegidos
* **Amazon S3 + CloudFront:** S3 es la forma más económica y rápida de alojar el build estático de Angular 18. CloudFront actúa como CDN entregando el contenido por HTTPS a baja latencia.
* **AWS App Runner:** En lugar de gestionar instancias EC2 o la complejidad de ECS/EKS, App Runner despliega contenedores Docker web directamente desde Amazon ECR. Escala automáticamente y abstrae el balanceador de carga.
* **Amazon RDS (PostgreSQL):** Base de datos relacional administrada. Se desplegaría en una subred privada usando un VPC Connector desde App Runner.

## 3. Estrategia CI/CD (GitHub Actions)
1. **Push a `main`:** Dispara el flujo de trabajo.
2. **Backend:** Ejecuta linting y pruebas. Construye la imagen Docker, la sube a Amazon ECR y actualiza App Runner.
3. **Frontend:** Ejecuta el build de Angular (`ng build`), sincroniza con el bucket S3 y genera una invalidación en CloudFront.

## 4. Estimación de Costos (MVP Mensual - Región us-east-1)
*Supuestos: Tráfico inicial bajo/moderado, un ambiente de producción, escalado mínimo.*

* **Amazon S3 + CloudFront:** ~$2.00 USD (Capa gratuita cubre gran parte inicial).
* **AWS App Runner:** ~$20.00 USD (Instancia base 1 vCPU / 2 GB RAM, escalado de 1 a 2).
* **Amazon RDS (PostgreSQL):** ~$15.00 USD (Instancia db.t4g.micro, Single-AZ para MVP).
* **AWS Secrets Manager + CloudWatch:** ~$3.00 USD.
* **Costo Total Estimado:** ~$40.00 USD / mes.