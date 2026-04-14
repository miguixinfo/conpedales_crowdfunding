# Fase 4 - Controladores REST

## Objetivo

Crear todos los controladores REST para exponer los endpoints de la API.

---

## 1. StageController (Público)

```java
package com.conpedales.controller;

import com.conpedales.dto.StageDTO;
import com.conpedales.service.StageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stages")
@RequiredArgsConstructor
public class StageController {

    private final StageService stageService;

    @GetMapping
    public ResponseEntity<List<StageDTO>> getAllStages() {
        return ResponseEntity.ok(stageService.getPublishedStages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StageDTO> getStageById(@PathVariable Long id) {
        return ResponseEntity.ok(stageService.getStageById(id));
    }

    @GetMapping("/latest")
    public ResponseEntity<StageDTO> getLatestStage() {
        return ResponseEntity.ok(stageService.getLatestStage());
    }
}
```

---

## 2. AdminStageController

```java
package com.conpedales.controller;

import com.conpedales.dto.CreateStageDTO;
import com.conpedales.dto.StageDTO;
import com.conpedales.dto.UpdateStageDTO;
import com.conpedales.service.StageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/stages")
@RequiredArgsConstructor
public class AdminStageController {

    private final StageService stageService;

    @GetMapping
    public ResponseEntity<List<StageDTO>> getAllStages() {
        return ResponseEntity.ok(stageService.getAllStages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StageDTO> getStageById(@PathVariable Long id) {
        return ResponseEntity.ok(stageService.getStageById(id));
    }

    @PostMapping
    public ResponseEntity<StageDTO> createStage(@Valid @RequestBody CreateStageDTO dto) {
        return ResponseEntity.ok(stageService.createStage(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StageDTO> updateStage(@PathVariable Long id, @RequestBody UpdateStageDTO dto) {
        return ResponseEntity.ok(stageService.updateStage(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStage(@PathVariable Long id) {
        stageService.deleteStage(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 3. SegmentController (Público)

```java
package com.conpedales.controller;

import com.conpedales.dto.RouteSegmentDTO;
import com.conpedales.service.RouteSegmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/segments")
@RequiredArgsConstructor
public class SegmentController {

    private final RouteSegmentService segmentService;

    @GetMapping("/stage/{stageId}")
    public ResponseEntity<List<RouteSegmentDTO>> getSegmentsByStageId(@PathVariable Long stageId) {
        return ResponseEntity.ok(segmentService.getSegmentsByStageId(stageId));
    }
}
```

---

## 4. AdminSegmentController

```java
package com.conpedales.controller;

import com.conpedales.dto.CreateRouteSegmentDTO;
import com.conpedales.dto.RouteSegmentDTO;
import com.conpedales.service.RouteSegmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/segments")
@RequiredArgsConstructor
public class AdminSegmentController {

    private final RouteSegmentService segmentService;

    @GetMapping("/{id}")
    public ResponseEntity<RouteSegmentDTO> getSegmentById(@PathVariable Long id) {
        return ResponseEntity.ok(segmentService.getSegmentById(id));
    }

    @PostMapping
    public ResponseEntity<RouteSegmentDTO> createSegment(@Valid @RequestBody CreateRouteSegmentDTO dto) {
        return ResponseEntity.ok(segmentService.createSegment(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RouteSegmentDTO> updateSegment(@PathVariable Long id, @Valid @RequestBody CreateRouteSegmentDTO dto) {
        return ResponseEntity.ok(segmentService.updateSegment(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSegment(@PathVariable Long id) {
        segmentService.deleteSegment(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 5. AdminSegmentEventController

```java
package com.conpedales.controller;

import com.conpedales.dto.CreateRouteSegmentEventDTO;
import com.conpedales.dto.RouteSegmentEventDTO;
import com.conpedales.service.RouteSegmentEventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/segments")
@RequiredArgsConstructor
public class AdminSegmentEventController {

    private final RouteSegmentEventService eventService;

    @GetMapping("/{segmentId}/events")
    public ResponseEntity<List<RouteSegmentEventDTO>> getEventsBySegmentId(@PathVariable Long segmentId) {
        return ResponseEntity.ok(eventService.getEventsBySegmentId(segmentId));
    }

    @PostMapping("/{segmentId}/events")
    public ResponseEntity<RouteSegmentEventDTO> createEvent(
            @PathVariable Long segmentId,
            @Valid @RequestBody CreateRouteSegmentEventDTO dto) {
        return ResponseEntity.ok(eventService.createEvent(segmentId, dto));
    }

    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 6. PhotoController (Público)

```java
package com.conpedales.controller;

import com.conpedales.dto.PhotoDTO;
import com.conpedales.service.PhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    @GetMapping
    public ResponseEntity<List<PhotoDTO>> getAllPhotos() {
        return ResponseEntity.ok(photoService.getAllPhotos());
    }

    @GetMapping("/stage/{stageId}")
    public ResponseEntity<List<PhotoDTO>> getPhotosByStageId(@PathVariable Long stageId) {
        return ResponseEntity.ok(photoService.getPhotosByStageId(stageId));
    }

    @GetMapping("/highlight")
    public ResponseEntity<List<PhotoDTO>> getHighlightPhotos() {
        return ResponseEntity.ok(photoService.getHighlightPhotos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhotoDTO> getPhotoById(@PathVariable Long id) {
        return ResponseEntity.ok(photoService.getPhotoById(id));
    }
}
```

---

## 7. AdminPhotoController

```java
package com.conpedales.controller;

import com.conpedales.dto.CreatePhotoDTO;
import com.conpedales.dto.PhotoDTO;
import com.conpedales.dto.UploadUrlResponse;
import com.conpedales.service.PhotoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/photos")
@RequiredArgsConstructor
public class AdminPhotoController {

    private final PhotoService photoService;

    @PostMapping("/upload-url")
    public ResponseEntity<UploadUrlResponse> generateUploadUrl() {
        return ResponseEntity.ok(photoService.generateUploadUrl());
    }

    @PostMapping
    public ResponseEntity<PhotoDTO> createPhoto(@Valid @RequestBody CreatePhotoDTO dto) {
        return ResponseEntity.ok(photoService.createPhoto(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePhoto(@PathVariable Long id) {
        photoService.deletePhoto(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 8. StatsController (Público)

```java
package com.conpedales.controller;

import com.conpedales.dto.StatsDTO;
import com.conpedales.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping
    public ResponseEntity<StatsDTO> getGlobalStats() {
        return ResponseEntity.ok(statsService.getGlobalStats());
    }
}
```

---

## 9. MapController (Público)

```java
package com.conpedales.controller;

import com.conpedales.dto.MapDataDTO;
import com.conpedales.service.MapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/map")
@RequiredArgsConstructor
public class MapController {

    private final MapService mapService;

    @GetMapping
    public ResponseEntity<MapDataDTO> getMapData() {
        return ResponseEntity.ok(mapService.getMapData());
    }
}
```

---

## 10. DonationController (Público)

```java
package com.conpedales.controller;

import com.conpedales.dto.CheckoutResponse;
import com.conpedales.dto.CreateCheckoutDTO;
import com.conpedales.dto.DonationFeedDTO;
import com.conpedales.service.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    @GetMapping("/feed")
    public ResponseEntity<List<DonationFeedDTO>> getDonationFeed() {
        return ResponseEntity.ok(donationService.getDonationFeed());
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> createCheckout(@Valid @RequestBody CreateCheckoutDTO dto) {
        return ResponseEntity.ok(donationService.createCheckoutSession(dto));
    }
}
```

---

## 11. StripeWebhookController

```java
package com.conpedales.controller;

import com.conpedales.service.DonationService;
import com.conpedales.service.StripeService;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stripe")
@RequiredArgsConstructor
@Slf4j
public class StripeWebhookController {

    private final StripeService stripeService;
    private final DonationService donationService;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
            
            switch (event.getType()) {
                case "checkout.session.completed":
                    stripeService.handleCheckoutSessionCompleted(event);
                    break;
                case "payment_intent.succeeded":
                    log.info("Payment succeeded: {}", event.getDataObjectJson());
                    break;
                default:
                    log.info("Unhandled event type: {}", event.getType());
            }
            
            return ResponseEntity.ok("ok");
        } catch (Exception e) {
            log.error("Error processing webhook: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error");
        }
    }
}
```

---

## 12. Resumen de Endpoints

### Endpoints Públicos

| Método | Endpoint | Descripción | Controlador |
|--------|---------|------------|-----------|
| GET | /stats | Estadísticas globales | StatsController |
| GET | /stages | Lista de etapas | StageController |
| GET | /stages/{id} | Detalle de etapa | StageController |
| GET | /stages/latest | Última etapa | StageController |
| GET | /segments/stage/{id} | Segmentos de etapa | SegmentController |
| GET | /map | Datos para mapa | MapController |
| GET | /photos | Todas las fotos | PhotoController |
| GET | /photos/stage/{id} | Fotos de etapa | PhotoController |
| GET | /photos/highlight | Fotos destacadas | PhotoController |
| GET | /donations/feed | Feed donations | DonationController |
| POST | /donations/checkout | Crear checkout | DonationController |

### Endpoints Admin (JWT)

| Método | Endpoint | Descripción | Controlador |
|--------|---------|------------|-----------|
| POST | /admin/auth/login | Login | AuthController |
| GET | /admin/stages | Lista etapas | AdminStageController |
| POST | /admin/stages | Crear etapa | AdminStageController |
| PUT | /admin/stages/{id} | Editar etapa | AdminStageController |
| DELETE | /admin/stages/{id} | Eliminar etapa | AdminStageController |
| GET | /admin/segments/{id} | Ver segmento | AdminSegmentController |
| POST | /admin/segments | Crear segmento | AdminSegmentController |
| PUT | /admin/segments/{id} | Editar segmento | AdminSegmentController |
| DELETE | /admin/segments/{id} | Eliminar segmento | AdminSegmentController |
| GET | /admin/segments/{id}/events | Ver eventos | AdminSegmentEventController |
| POST | /admin/segments/{id}/events | Crear evento | AdminSegmentEventController |
| DELETE | /admin/segments/events/{id} | Eliminar evento | AdminSegmentEventController |
| POST | /admin/photos/upload-url | Generar URL | AdminPhotoController |
| POST | /admin/photos | Crear foto | AdminPhotoController |
| DELETE | /admin/photos/{id} | Eliminar foto | AdminPhotoController |

### Webhook

| Método | Endpoint | Descripción |
|--------|---------|-------------|
| POST | /stripe/webhook | Webhook Stripe |

---

## 13. Configuración CORS (si es necesario)

```java
package com.conpedales.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("https://conpedales.com", "http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

---

## 14. Resumen de Controladores

| Controlador | Paquete | Endpoints |
|-----------|--------|---------|
| AuthController | controller | /login |
| StageController | controller | /stages |
| AdminStageController | controller | /admin/stages |
| SegmentController | controller | /segments |
| AdminSegmentController | controller | /admin/segments |
| AdminSegmentEventController | controller | /admin/segments/*/events |
| PhotoController | controller | /photos |
| AdminPhotoController | controller | /admin/photos |
| StatsController | controller | /stats |
| MapController | controller | /map |
| DonationController | controller | /donations |
| StripeWebhookController | controller | /stripe/webhook |