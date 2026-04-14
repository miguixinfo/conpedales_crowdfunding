# Fase 2 - DTOs y Repositorios

## Objetivo

Crear los Data Transfer Objects (DTOs) para comunicación API y los Repositorios JPA para acceso a datos.

---

## 1. DTOs de Stage

### StageDTO.java (respuesta)
```java
package com.conpedales.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StageDTO {
    private Long id;
    private Integer dayNumber;
    private String country;
    private String startName;
    private Double startLat;
    private Double startLng;
    private String endName;
    private Double endLat;
    private Double endLng;
    private Double km;
    private Double elevationGain;
    private String movingTime;
    private String description;
    private Boolean isPublished;
    private LocalDateTime createdAt;
    private List<RouteSegmentDTO> segments;
    private List<PhotoDTO> photos;
}
```

### CreateStageDTO.java (creation)
```java
package com.conpedales.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateStageDTO {
    @NotNull(message = "El número de día es obligatorio")
    private Integer dayNumber;

    @NotBlank(message = "El país es obligatorio")
    private String country;

    @NotBlank(message = "El nombre de inicio es obligatorio")
    private String startName;

    @NotNull(message = "La latitud de inicio es obligatoria")
    private Double startLat;

    @NotNull(message = "La longitud de inicio es obligatoria")
    private Double startLng;

    @NotBlank(message = "El nombre de fin es obligatorio")
    private String endName;

    @NotNull(message = "La latitud de fin es obligatoria")
    private Double endLat;

    @NotNull(message = "La longitud de fin es obligatoria")
    private Double endLng;

    @NotNull(message = "Los km son obligatorios")
    @Min(value = 0, message = "Los km no pueden ser negativos")
    private Double km;

    @NotNull(message = "El desnivel es obligatorio")
    @Min(value = 0, message = "El desnivel no puede ser negativo")
    private Double elevationGain;

    private String movingTime;

    private String description;

    private Boolean isPublished = false;
}
```

### UpdateStageDTO.java (update)
```java
package com.conpedales.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStageDTO {
    private Integer dayNumber;
    private String country;
    private String startName;
    private Double startLat;
    private Double startLng;
    private String endName;
    private Double endLat;
    private Double endLng;
    private Double km;
    private Double elevationGain;
    private String movingTime;
    private String description;
    private Boolean isPublished;
}
```

---

## 2. DTOs de RouteSegment

### RouteSegmentDTO.java
```java
package com.conpedales.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RouteSegmentDTO {
    private Long id;
    private Long stageId;
    private String startName;
    private Double startLat;
    private Double startLng;
    private String endName;
    private Double endLat;
    private Double endLng;
    private Double km;
    private Double elevationGain;
    private LocalDateTime createdAt;
    private List<RouteSegmentEventDTO> events;
    private List<PhotoDTO> photos;
}
```

### CreateRouteSegmentDTO.java
```java
package com.conpedales.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateRouteSegmentDTO {
    @NotNull(message = "El ID de etapa es obligatorio")
    private Long stageId;

    @NotBlank(message = "El nombre de inicio es obligatorio")
    private String startName;

    @NotNull(message = "La latitud de inicio es obligatoria")
    private Double startLat;

    @NotNull(message = "La longitud de inicio es obligatoria")
    private Double startLng;

    @NotBlank(message = "El nombre de fin es obligatorio")
    private String endName;

    @NotNull(message = "La latitud de fin es obligatoria")
    private Double endLat;

    @NotNull(message = "La longitud de fin es obligatoria")
    private Double endLng;

    @NotNull(message = "Los km son obligatorios")
    @Min(value = 0, message = "Los km no pueden ser negativos")
    private Double km;

    @NotNull(message = "El desnivel es obligatorio")
    @Min(value = 0, message = "El desnivel no puede ser negativo")
    private Double elevationGain;
}
```

---

## 3. DTOs de RouteSegmentEvent

### RouteSegmentEventDTO.java
```java
package com.conpedales.dto;

import com.conpedales.model.RouteSegmentEventEntity;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RouteSegmentEventDTO {
    private Long id;
    private Long segmentId;
    private RouteSegmentEventEntity.EventType type;
    private String description;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;
}
```

### CreateRouteSegmentEventDTO.java
```java
package com.conpedales.dto;

import com.conpedales.model.RouteSegmentEventEntity;
import jakarta.validation.constraints.*;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateRouteSegmentEventDTO {
    @NotNull(message = "El tipo de evento es obligatorio")
    private RouteSegmentEventEntity.EventType type;

    private String description;

    private Double latitude;

    private Double longitude;
}
```

---

## 4. DTOs de Photo

### PhotoDTO.java
```java
package com.conpedales.dto;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhotoDTO {
    private Long id;
    private Long stageId;
    private Long segmentId;
    private String url;
    private String caption;
    private LocalDateTime takenAt;
    private Double latitude;
    private Double longitude;
    private Boolean isHighlight;
    private LocalDateTime createdAt;
}
```

### CreatePhotoDTO.java
```java
package com.conpedales.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePhotoDTO {
    private Long stageId;

    private Long segmentId;

    @NotBlank(message = "La URL es obligatoria")
    private String url;

    private String caption;

    private LocalDateTime takenAt;

    private Double latitude;

    private Double longitude;

    private Boolean isHighlight = false;
}
```

### UploadUrlResponse.java
```java
package com.conpedales.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UploadUrlResponse {
    private String uploadUrl;
    private String fileUrl;
    private String key;
}
```

---

## 5. DTOs de Donation

### DonationDTO.java
```java
package com.conpedales.dto;

import com.conpedales.model.DonationEntity;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonationDTO {
    private Long id;
    private String stripePaymentIntent;
    private Integer amount;
    private DonationEntity.DonationStatus status;
    private String donorName;
    private String donorEmail;
    private LocalDateTime createdAt;
    private CommentDTO comment;
}
```

### DonationFeedDTO.java
```java
package com.conpedales.dto;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonationFeedDTO {
    private String name;
    private Integer amount;
    private String comment;
    private LocalDateTime date;
}
```

### CreateCheckoutDTO.java
```java
package com.conpedales.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateCheckoutDTO {
    @NotNull(message = "El amount es obligatorio")
    @Min(value = 1, message = "El mínimo es 1€")
    private Integer amount;

    private String name;

    private String email;

    private String comment;

    private String successUrl;

    private String cancelUrl;
}
```

### CheckoutResponse.java
```java
package com.conpedales.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponse {
    private String sessionId;
    private String checkoutUrl;
}
```

---

## 6. DTOs de Comment

### CommentDTO.java
```java
package com.conpedales.dto;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long id;
    private Long donationId;
    private String message;
    private LocalDateTime createdAt;
}
```

---

## 7. DTOs de Mapa

### MapDataDTO.java
```java
package com.conpedales.dto;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MapDataDTO {
    private List<StageMapDTO> stages;
    private List<SegmentMapDTO> segments;
    private List<PhotoMapDTO> photos;
    private List<EventMapDTO> events;
}
```

### StageMapDTO.java
```java
package com.conpedales.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StageMapDTO {
    private Long id;
    private Integer dayNumber;
    private Double startLat;
    private Double startLng;
    private Double endLat;
    private Double endLng;
    private String country;
}
```

### SegmentMapDTO.java
```java
package com.conpedales.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SegmentMapDTO {
    private Long id;
    private Long stageId;
    private Double startLat;
    private Double startLng;
    private Double endLat;
    private Double endLng;
}
```

### PhotoMapDTO.java
```java
package com.conpedales.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhotoMapDTO {
    private Long id;
    private String url;
    private Double latitude;
    private Double longitude;
}
```

### EventMapDTO.java
```java
package com.conpedales.dto;

import com.conpedales.model.RouteSegmentEventEntity;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventMapDTO {
    private Long id;
    private String type;
    private String description;
    private Double latitude;
    private Double longitude;
}
```

---

## 8. Repositorios JPA

### StageRepository.java
```java
package com.conpedales.repository;

import com.conpedales.model.StageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StageRepository extends JpaRepository<StageEntity, Long> {

    List<StageEntity> findAllByOrderByDayNumberAsc();

    List<StageEntity> findAllByIsPublishedTrueOrderByDayNumberAsc();

    Optional<StageEntity> findByDayNumber(Integer dayNumber);

    Optional<StageEntity> findTopByIsPublishedTrueOrderByDayNumberDesc();

    boolean existsByDayNumber(Integer dayNumber);

    @Query("SELECT MAX(s.dayNumber) FROM StageEntity s")
    Optional<Integer> findMaxDayNumber();
}
```

### RouteSegmentRepository.java
```java
package com.conpedales.repository;

import com.conpedales.model.RouteSegmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteSegmentRepository extends JpaRepository<RouteSegmentEntity, Long> {

    List<RouteSegmentEntity> findByStageIdOrderByCreatedAtAsc(Long stageId);

    List<RouteSegmentEntity> findByStageIdInOrderByCreatedAtAsc(List<Long> stageIds);
}
```

### RouteSegmentEventRepository.java
```java
package com.conpedales.repository;

import com.conpedales.model.RouteSegmentEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteSegmentEventRepository extends JpaRepository<RouteSegmentEventEntity, Long> {

    List<RouteSegmentEventEntity> findBySegmentId(Long segmentId);

    @Query("SELECT e FROM RouteSegmentEventEntity e WHERE e.segment.stage.id = :stageId")
    List<RouteSegmentEventEntity> findByStageId(Long stageId);
}
```

### PhotoRepository.java
```java
package com.conpedales.repository;

import com.conpedales.model.PhotoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhotoRepository extends JpaRepository<PhotoEntity, Long> {

    List<PhotoEntity> findByStageId(Long stageId);

    List<PhotoEntity> findBySegmentId(Long segmentId);

    List<PhotoEntity> findByStageIdAndIsHighlightTrue(Long stageId);

    Optional<PhotoEntity> findFirstByIsHighlightTrueOrderByCreatedAtDesc();

    @Query("SELECT p FROM PhotoEntity p WHERE p.stage.id IN :stageIds")
    List<PhotoEntity> findByStageIds(List<Long> stageIds);

    @Query("SELECT p FROM PhotoEntity p WHERE p.isHighlight = true")
    List<PhotoEntity> findAllHighlights();
}
```

### DonationRepository.java
```java
package com.conpedales.repository;

import com.conpedales.model.DonationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonationRepository extends JpaRepository<DonationEntity, Long> {

    List<DonationEntity> findAllByStatusOrderByCreatedAtDesc(DonationEntity.DonationStatus status);

    Optional<DonationEntity> findByStripeSessionId(String sessionId);

    Optional<DonationEntity> findByStripePaymentIntent(String paymentIntent);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM DonationEntity d WHERE d.status = 'COMPLETED'")
    Long sumCompletedAmount();

    @Query("SELECT COUNT(d) FROM DonationEntity d WHERE d.status = 'COMPLETED'")
    Long countCompleted();

    @Query("SELECT COUNT(DISTINCT d.donorEmail) FROM DonationEntity d WHERE d.status = 'COMPLETED' AND d.donorEmail IS NOT NULL")
    Long countUniqueDonors();
}
```

### CommentRepository.java
```java
package com.conpedales.repository;

import com.conpedales.model.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    Optional<CommentEntity> findByDonationId(Long donationId);

    @Query("SELECT c FROM CommentEntity c WHERE c.donation.status = 'COMPLETED' ORDER BY c.donation.createdAt DESC")
    List<CommentEntity> findAllByDonationStatusCompleted();

    @Query("SELECT c FROM CommentEntity c ORDER BY c.donation.createdAt DESC")
    List<CommentEntity> findAllOrderByCreatedAtDesc();
}

---

## 9. Resumen

### DTOs Creados
| DTO | Uso |
|-----|-----|
| StageDTO | Respuesta de etapa |
| CreateStageDTO | Crear etapa |
| UpdateStageDTO | Actualizar etapa |
| RouteSegmentDTO | Respuesta de segmento |
| CreateRouteSegmentDTO | Crear segmento |
| RouteSegmentEventDTO | Respuesta de evento |
| CreateRouteSegmentEventDTO | Crear evento |
| PhotoDTO | Respuesta de foto |
| CreatePhotoDTO | Crear foto |
| UploadUrlResponse | URL de upload |
| DonationDTO | Respuesta de donación |
| DonationFeedDTO | Feed de donaciones |
| CreateCheckoutDTO | Checkout Stripe |
| CheckoutResponse | URL checkout |
| CommentDTO | Respuesta de comentario |
| MapDataDTO | Datos para mapa |

### Repositorios Creados
| Repositorio | Entidad |
|------------|--------|
| StageRepository | StageEntity |
| RouteSegmentRepository | RouteSegmentEntity |
| RouteSegmentEventRepository | RouteSegmentEventEntity |
| PhotoRepository | PhotoEntity |
| DonationRepository | DonationEntity |
| CommentRepository | CommentEntity |