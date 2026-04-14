# ConPedales - Backend API

**Crowdfunding del viaje Toledo → Atenas en bicicleta**

---

## Descripción del proyecto

ConPedales es una plataforma de crowdfunding para financiar y seguir un viaje épico en bicicleta desde Toledo hasta Atenas. El proyecto consiste en:

- **Backend**: API RESTful con Spring Boot (monolítico)
- **Frontend**: React/React Native (ya implementado)
- **Pagos**: Stripe
- **Imágenes**: Cloudflare R2 (o almacenamiento local)

## stack tecnológico

| Componente | Tecnología |
|------------|-------------|
| Backend | Spring Boot 3.x |
| Build | Apache Maven |
| BD | PostgreSQL |
| Auth | JWT |
| Pagos | Stripe |
| Imágenes | Cloudflare R2 |

## Arquitectura

```
conpedales-api/
├── src/main/java/com/conpedales/
│   ├── config/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   ├── dto/
│   ├── security/
│   └── exception/
```

## Base de datos

6 entidades principales:

- **Stage** - Etapas del viaje
- **RouteSegment** - Segmentos/rutitas dentro de etapas
- **RouteSegmentEvent** - Eventos en segmentos
- **Photo** - Fotos del viaje
- **Donation** - Donaciones
- **Comment** - Comentarios de donantes

## Endpoints públicos

| Método | Endpoint | Descripción |
|--------|----------|--------------|
| GET | /stats | Estadísticas globales |
| GET | /stages | Lista de etapas |
| GET | /stages/{id} | Detalle de etapa |
| GET | /stages/latest | Última etapa |
| GET | /segments/stage/{id} | Segmentos de etapa |
| GET | /map | Datos para mapa |
| GET | /photos | Fotos |
| GET | /donations/feed | Feed de donaciones |
| POST | /donations/checkout | Crear sesión de pago |
| POST | /stripe/webhook | Webhook de Stripe |

## Endpoints Admin (JWT)

| Método | Endpoint | Descripción |
|--------|----------|--------------|
| POST | /admin/auth/login | Autenticación |
| POST | /admin/stages | Crear etapa |
| PUT | /admin/stages/{id} | Editar etapa |
| DELETE | /admin/stages/{id} | Eliminar etapa |
| POST | /admin/segments | Crear segmento |
| PUT | /admin/segments/{id} | Editar segmento |
| DELETE | /admin/segments/{id} | Eliminar segmento |
| POST | /admin/segments/{id}/events | Añadir evento |
| POST | /admin/photos | Subir foto |
| DELETE | /admin/photos/{id} | Eliminar foto |

## Historias de Usuario (29 HU)

### Épica 1 - Visualización del viaje
- HU-1: Ver estadísticas globales
- HU-2: Ver todas las etapas
- HU-3: Ver detalle de etapa
- HU-4: Ver rutitas de etapa
- HU-5: Ver fotos del viaje
- HU-6: Ver última etapa publicada

### Épica 2 - Mapa interactivo
- HU-7: Ver el mapa del recorrido
- HU-8: Ver eventos en el mapa
- HU-9: Ver fotos en el mapa

### Épica 3 - Crowdfunding
- HU-10: Realizar donación
- HU-11: Asociar comentario a donación
- HU-12: Ver feed de donaciones
- HU-13: Ver total financiado

### Épica 4 - Gestión de contenido (Admin)
- HU-14: Crear etapa
- HU-15: Editar etapa
- HU-16: Eliminar etapa
- HU-17: Crear rutita
- HU-18: Añadir eventos a rutita

### Épica 5 - Gestión de fotos
- HU-19: Subir foto
- HU-20: Asociar foto a rutita
- HU-21: Asociar foto a etapa

### Épica 6 - Seguridad
- HU-22: Autenticación de administrador
- HU-23: Acceso protegido a endpoints admin

### Épica 7 - Integración de pagos
- HU-24: Crear sesión de pago
- HU-25: Procesar webhook de pago
- HU-26: Registrar donación
- HU-27: Registrar comentario del donante

### Épica 8 - Estadísticas
- HU-28: Calcular estadísticas globales
- HU-29: Calcular km financiados

## Fases de desarrollo

| Fase | Contenido |
|------|------------|
| F0 | Base proyecto y seguridad |
| F1 | Modelo de dominio (entidades JPA) |
| F2 | Repositorios |
| F3 | Servicios |
| F4 | Controladores REST |
| F5 | Extras (Stripe, fotos, mapa) |

## Convenciones

- **Paquetes**: lowercase (controller, service, repository, model, dto, config, security, exception)
- **Entidades**: Entity suffix (StageEntity, RouteSegmentEntity, etc.)
- **DTOs**: DTO suffix (StageDTO, CreateStageDTO, etc.)
- **Controladores**: Controller suffix (StageController)
- **Servicios**: Service suffix (StageService)
- **Repositorios**: Repository suffix (StageRepository)

## Variables de entorno

```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/conpedales
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=password

JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

CLOUDFLARE_R2_ACCESS_KEY=...
CLOUDFLARE_R2_SECRET_KEY=...
CLOUDFLARE_R2_BUCKET=conpedales-photos
CLOUDFLARE_R2_ACCOUNT_ID=...
```

## Deployment

El proyecto está configurado para desplegarse en cualquier servidor que soporte Java 17+ con PostgreSQL.

---

**ConPedales** - De Toledo a Atenas, pedalada a pedalada.