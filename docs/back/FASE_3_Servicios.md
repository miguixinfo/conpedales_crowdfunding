# Fase 3 - Servicios

## Objetivo

Crear la capa de servicios (lógica de negocio) para todas las entidades del sistema.

---

## 1. StageService

### StageService.java
```java
package com.conpedales.service;

import com.conpedales.dto.*;
import com.conpedales.exception.ResourceNotFoundException;
import com.conpedales.exception.ValidationException;
import com.conpedales.model.StageEntity;
import com.conpedales.repository.StageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StageService {

    private final StageRepository stageRepository;

    @Transactional(readOnly = true)
    public List<StageDTO> getAllStages() {
        return stageRepository.findAllByOrderByDayNumberAsc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StageDTO> getPublishedStages() {
        return stageRepository.findAllByIsPublishedTrueOrderByDayNumberAsc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StageDTO getStageById(Long id) {
        StageEntity stage = stageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Etapa no encontrada: " + id));
        return toDTO(stage);
    }

    @Transactional(readOnly = true)
    public StageDTO getLatestStage() {
        StageEntity stage = stageRepository.findTopByIsPublishedTrueOrderByDayNumberDesc()
                .orElseThrow(() -> new ResourceNotFoundException("No hay etapas publicadas"));
        return toDTO(stage);
    }

    @Transactional
    public StageDTO createStage(CreateStageDTO dto) {
        if (stageRepository.existsByDayNumber(dto.getDayNumber())) {
            throw new ValidationException("Ya existe una etapa con el día: " + dto.getDayNumber());
        }

        StageEntity stage = StageEntity.builder()
                .dayNumber(dto.getDayNumber())
                .country(dto.getCountry())
                .startName(dto.getStartName())
                .startLat(dto.getStartLat())
                .startLng(dto.getStartLng())
                .endName(dto.getEndName())
                .endLat(dto.getEndLat())
                .endLng(dto.getEndLng())
                .km(dto.getKm())
                .elevationGain(dto.getElevationGain())
                .movingTime(dto.getMovingTime())
                .description(dto.getDescription())
                .isPublished(dto.getIsPublished() != null ? dto.getIsPublished() : false)
                .build();

        StageEntity saved = stageRepository.save(stage);
        return toDTO(saved);
    }

    @Transactional
    public StageDTO updateStage(Long id, UpdateStageDTO dto) {
        StageEntity stage = stageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Etapa no encontrada: " + id));

        if (dto.getDayNumber() != null && !dto.getDayNumber().equals(stage.getDayNumber())) {
            if (stageRepository.existsByDayNumber(dto.getDayNumber())) {
                throw new ValidationException("Ya existe una etapa con el día: " + dto.getDayNumber());
            }
            stage.setDayNumber(dto.getDayNumber());
        }
        if (dto.getCountry() != null) stage.setCountry(dto.getCountry());
        if (dto.getStartName() != null) stage.setStartName(dto.getStartName());
        if (dto.getStartLat() != null) stage.setStartLat(dto.getStartLat());
        if (dto.getStartLng() != null) stage.setStartLng(dto.getStartLng());
        if (dto.getEndName() != null) stage.setEndName(dto.getEndName());
        if (dto.getEndLat() != null) stage.setEndLat(dto.getEndLat());
        if (dto.getEndLng() != null) stage.setEndLng(dto.getEndLng());
        if (dto.getKm() != null) stage.setKm(dto.getKm());
        if (dto.getElevationGain() != null) stage.setElevationGain(dto.getElevationGain());
        if (dto.getMovingTime() != null) stage.setMovingTime(dto.getMovingTime());
        if (dto.getDescription() != null) stage.setDescription(dto.getDescription());
        if (dto.getIsPublished() != null) stage.setIsPublished(dto.getIsPublished());

        StageEntity saved = stageRepository.save(stage);
        return toDTO(saved);
    }

    @Transactional
    public void deleteStage(Long id) {
        if (!stageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Etapa no encontrada: " + id);
        }
        stageRepository.deleteById(id);
    }

    private StageDTO toDTO(StageEntity stage) {
        return StageDTO.builder()
                .id(stage.getId())
                .dayNumber(stage.getDayNumber())
                .country(stage.getCountry())
                .startName(stage.getStartName())
                .startLat(stage.getStartLat())
                .startLng(stage.getStartLng())
                .endName(stage.getEndName())
                .endLat(stage.getEndLat())
                .endLng(stage.getEndLng())
                .km(stage.getKm())
                .elevationGain(stage.getElevationGain())
                .movingTime(stage.getMovingTime())
                .description(stage.getDescription())
                .isPublished(stage.getIsPublished())
                .createdAt(stage.getCreatedAt())
                .build();
    }
}
```

---

## 2. RouteSegmentService

### RouteSegmentService.java
```java
package com.conpedales.service;

import com.conpedales.dto.*;
import com.conpedales.exception.ResourceNotFoundException;
import com.conpedales.model.RouteSegmentEntity;
import com.conpedales.model.StageEntity;
import com.conpedales.repository.RouteSegmentRepository;
import com.conpedales.repository.StageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteSegmentService {

    private final RouteSegmentRepository segmentRepository;
    private final StageRepository stageRepository;

    @Transactional(readOnly = true)
    public List<RouteSegmentDTO> getSegmentsByStageId(Long stageId) {
        if (!stageRepository.existsById(stageId)) {
            throw new ResourceNotFoundException("Etapa no encontrada: " + stageId);
        }
        return segmentRepository.findByStageIdOrderByCreatedAtAsc(stageId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RouteSegmentDTO getSegmentById(Long id) {
        RouteSegmentEntity segment = segmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Segmento no encontrado: " + id));
        return toDTO(segment);
    }

    @Transactional
    public RouteSegmentDTO createSegment(CreateRouteSegmentDTO dto) {
        StageEntity stage = stageRepository.findById(dto.getStageId())
                .orElseThrow(() -> new ResourceNotFoundException("Etapa no encontrada: " + dto.getStageId()));

        RouteSegmentEntity segment = RouteSegmentEntity.builder()
                .stage(stage)
                .startName(dto.getStartName())
                .startLat(dto.getStartLat())
                .startLng(dto.getStartLng())
                .endName(dto.getEndName())
                .endLat(dto.getEndLat())
                .endLng(dto.getEndLng())
                .km(dto.getKm())
                .elevationGain(dto.getElevationGain())
                .build();

        RouteSegmentEntity saved = segmentRepository.save(segment);
        return toDTO(saved);
    }

    @Transactional
    public RouteSegmentDTO updateSegment(Long id, CreateRouteSegmentDTO dto) {
        RouteSegmentEntity segment = segmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Segmento no encontrado: " + id));

        if (dto.getStartName() != null) segment.setStartName(dto.getStartName());
        if (dto.getStartLat() != null) segment.setStartLat(dto.getStartLat());
        if (dto.getStartLng() != null) segment.setStartLng(dto.getStartLng());
        if (dto.getEndName() != null) segment.setEndName(dto.getEndName());
        if (dto.getEndLat() != null) segment.setEndLat(dto.getEndLat());
        if (dto.getEndLng() != null) segment.setEndLng(dto.getEndLng());
        if (dto.getKm() != null) segment.setKm(dto.getKm());
        if (dto.getElevationGain() != null) segment.setElevationGain(dto.getElevationGain());

        RouteSegmentEntity saved = segmentRepository.save(segment);
        return toDTO(saved);
    }

    @Transactional
    public void deleteSegment(Long id) {
        if (!segmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Segmento no encontrado: " + id);
        }
        segmentRepository.deleteById(id);
    }

    private RouteSegmentDTO toDTO(RouteSegmentEntity segment) {
        return RouteSegmentDTO.builder()
                .id(segment.getId())
                .stageId(segment.getStage().getId())
                .startName(segment.getStartName())
                .startLat(segment.getStartLat())
                .startLng(segment.getStartLng())
                .endName(segment.getEndName())
                .endLat(segment.getEndLat())
                .endLng(segment.getEndLng())
                .km(segment.getKm())
                .elevationGain(segment.getElevationGain())
                .createdAt(segment.getCreatedAt())
                .build();
    }
}
```

---

## 3. RouteSegmentEventService

### RouteSegmentEventService.java
```java
package com.conpedales.service;

import com.conpedales.dto.*;
import com.conpedales.exception.ResourceNotFoundException;
import com.conpedales.model.RouteSegmentEntity;
import com.conpedales.model.RouteSegmentEventEntity;
import com.conpedales.repository.RouteSegmentEventRepository;
import com.conpedales.repository.RouteSegmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteSegmentEventService {

    private final RouteSegmentEventRepository eventRepository;
    private final RouteSegmentRepository segmentRepository;

    @Transactional(readOnly = true)
    public List<RouteSegmentEventDTO> getEventsBySegmentId(Long segmentId) {
        if (!segmentRepository.existsById(segmentId)) {
            throw new ResourceNotFoundException("Segmento no encontrado: " + segmentId);
        }
        return eventRepository.findBySegmentId(segmentId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public RouteSegmentEventDTO createEvent(Long segmentId, CreateRouteSegmentEventDTO dto) {
        RouteSegmentEntity segment = segmentRepository.findById(segmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Segmento no encontrado: " + segmentId));

        RouteSegmentEventEntity event = RouteSegmentEventEntity.builder()
                .segment(segment)
                .type(dto.getType())
                .description(dto.getDescription())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .build();

        RouteSegmentEventEntity saved = eventRepository.save(event);
        return toDTO(saved);
    }

    @Transactional
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Evento no encontrado: " + id);
        }
        eventRepository.deleteById(id);
    }

    private RouteSegmentEventDTO toDTO(RouteSegmentEventEntity event) {
        return RouteSegmentEventDTO.builder()
                .id(event.getId())
                .segmentId(event.getSegment().getId())
                .type(event.getType())
                .description(event.getDescription())
                .latitude(event.getLatitude())
                .longitude(event.getLongitude())
                .createdAt(event.getCreatedAt())
                .build();
    }
}
```

---

## 4. PhotoService

### PhotoService.java
```java
package com.conpedales.service;

import com.conpedales.dto.*;
import com.conpedales.exception.ResourceNotFoundException;
import com.conpedales.model.PhotoEntity;
import com.conpedales.model.RouteSegmentEntity;
import com.conpedales.model.StageEntity;
import com.conpedales.repository.PhotoRepository;
import com.conpedales.repository.RouteSegmentRepository;
import com.conpedales.repository.StageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final StageRepository stageRepository;
    private final RouteSegmentRepository segmentRepository;

    @Transactional(readOnly = true)
    public List<PhotoDTO> getPhotosByStageId(Long stageId) {
        return photoRepository.findByStageId(stageId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PhotoDTO> getAllPhotos() {
        return photoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PhotoDTO getPhotoById(Long id) {
        PhotoEntity photo = photoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Foto no encontrada: " + id));
        return toDTO(photo);
    }

    @Transactional
    public PhotoDTO createPhoto(CreatePhotoDTO dto) {
        StageEntity stage = null;
        RouteSegmentEntity segment = null;

        if (dto.getStageId() != null) {
            stage = stageRepository.findById(dto.getStageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Etapa no encontrada: " + dto.getStageId()));
        }
        if (dto.getSegmentId() != null) {
            segment = segmentRepository.findById(dto.getSegmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Segmento no encontrado: " + dto.getSegmentId()));
        }

        if (dto.getIsHighlight() != null && dto.getIsHighlight()) {
            if (stage != null) {
                photoRepository.findByStageIdAndIsHighlightTrue(stage.getId())
                        .forEach(p -> {
                            p.setIsHighlight(false);
                            photoRepository.save(p);
                        });
            }
        }

        PhotoEntity photo = PhotoEntity.builder()
                .stage(stage)
                .segment(segment)
                .url(dto.getUrl())
                .caption(dto.getCaption())
                .takenAt(dto.getTakenAt())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .isHighlight(dto.getIsHighlight() != null ? dto.getIsHighlight() : false)
                .build();

        PhotoEntity saved = photoRepository.save(photo);
        return toDTO(saved);
    }

    @Transactional
    public void deletePhoto(Long id) {
        if (!photoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Foto no encontrada: " + id);
        }
        photoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<PhotoDTO> getHighlightPhotos() {
        return photoRepository.findAllHighlights()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UploadUrlResponse generateUploadUrl() {
        String key = "photos/" + UUID.randomUUID().toString();
        String uploadUrl = "/upload/" + key;
        String fileUrl = "https://conpedales-photos.example.com/" + key;

        return UploadUrlResponse.builder()
                .uploadUrl(uploadUrl)
                .fileUrl(fileUrl)
                .key(key)
                .build();
    }

    private PhotoDTO toDTO(PhotoEntity photo) {
        return PhotoDTO.builder()
                .id(photo.getId())
                .stageId(photo.getStage() != null ? photo.getStage().getId() : null)
                .segmentId(photo.getSegment() != null ? photo.getSegment().getId() : null)
                .url(photo.getUrl())
                .caption(photo.getCaption())
                .takenAt(photo.getTakenAt())
                .latitude(photo.getLatitude())
                .longitude(photo.getLongitude())
                .isHighlight(photo.getIsHighlight())
                .createdAt(photo.getCreatedAt())
                .build();
    }
}
```

---

## 5. StatsService

### StatsService.java
```java
package com.conpedales.service;

import com.conpedales.dto.StageDTO;
import com.conpedales.dto.StatsDTO;
import com.conpedales.model.DonationEntity;
import com.conpedales.model.StageEntity;
import com.conpedales.repository.DonationRepository;
import com.conpedales.repository.StageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final StageRepository stageRepository;
    private final DonationRepository donationRepository;

    @Transactional(readOnly = true)
    public StatsDTO getGlobalStats() {
        List<StageEntity> publishedStages = stageRepository.findAllByIsPublishedTrueOrderByDayNumberAsc();

        Long totalKm = publishedStages.stream()
                .mapToLong(s -> s.getKm().longValue())
                .sum();

        Long totalElevation = publishedStages.stream()
                .mapToLong(s -> s.getElevationGain().longValue())
                .sum();

        Integer totalStages = publishedStages.size();

        Long totalFunded = donationRepository.sumCompletedAmount();

        Long totalDonations = donationRepository.countCompleted();

        Long totalDonors = donationRepository.countUniqueDonors();

        return StatsDTO.builder()
                .totalKm(totalKm)
                .totalElevation(totalElevation)
                .totalStages(totalStages)
                .totalFunded(totalFunded != null ? totalFunded : 0L)
                .totalDonations(totalDonations != null ? totalDonations.intValue() : 0)
                .totalDonors(totalDonors != null ? totalDonors.intValue() : 0)
                .build();
    }
}
```

---

## 6. DonationService

### DonationService.java
```java
package com.conpedales.service;

import com.conpedales.dto.*;
import com.conpedales.exception.ResourceNotFoundException;
import com.conpedales.model.CommentEntity;
import com.conpedales.model.DonationEntity;
import com.conpedales.repository.CommentRepository;
import com.conpedales.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;
    private final CommentRepository commentRepository;
    private final StripeService stripeService;

    @Transactional(readOnly = true)
    public List<DonationFeedDTO> getDonationFeed() {
        return commentRepository.findAllByDonationStatusCompleted()
                .stream()
                .map(comment -> DonationFeedDTO.builder()
                        .name(comment.getDonation().getDonorName())
                        .amount(comment.getDonation().getAmount())
                        .comment(comment.getMessage())
                        .date(comment.getDonation().getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public CheckoutResponse createCheckoutSession(CreateCheckoutDTO dto) {
        return stripeService.createCheckoutSession(dto);
    }

    @Transactional
    public DonationEntity processSuccessfulPayment(String sessionId, String paymentIntentId) {
        DonationEntity donation = donationRepository.findByStripeSessionId(sessionId)
                .orElse(DonationEntity.builder()
                        .stripeSessionId(sessionId)
                        .build());

        donation.setStripePaymentIntent(paymentIntentId);
        donation.setStatus(DonationEntity.DonationStatus.COMPLETED);

        return donationRepository.save(donation);
    }

    @Transactional
    public void saveComment(Long donationId, String message) {
        DonationEntity donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donación no encontrada: " + donationId));

        CommentEntity comment = commentRepository.findByDonationId(donationId)
                .orElse(CommentEntity.builder()
                        .donation(donation)
                        .build());

        comment.setMessage(message);
        commentRepository.save(comment);
    }

    @Transactional
    public DonationDTO getDonationById(Long id) {
        DonationEntity donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donación no encontrada: " + id));
        return toDTO(donation);
    }

    private DonationDTO toDTO(DonationEntity donation) {
        return DonationDTO.builder()
                .id(donation.getId())
                .stripePaymentIntent(donation.getStripePaymentIntent())
                .amount(donation.getAmount())
                .status(donation.getStatus())
                .donorName(donation.getDonorName())
                .donorEmail(donation.getDonorEmail())
                .createdAt(donation.getCreatedAt())
                .build();
    }
}
```

---

## 7. MapService

### MapService.java
```java
package com.conpedales.service;

import com.conpedales.dto.*;
import com.conpedales.model.RouteSegmentEventEntity;
import com.conpedales.model.RouteSegmentEntity;
import com.conpedales.model.StageEntity;
import com.conpedales.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MapService {

    private final StageRepository stageRepository;
    private final RouteSegmentRepository segmentRepository;
    private final RouteSegmentEventRepository eventRepository;
    private final PhotoRepository photoRepository;

    @Transactional(readOnly = true)
    public MapDataDTO getMapData() {
        List<StageEntity> stages = stageRepository.findAllByIsPublishedTrueOrderByDayNumberAsc();
        List<Long> stageIds = stages.stream().map(StageEntity::getId).collect(Collectors.toList());

        List<RouteSegmentEntity> segments = segmentRepository.findByStageIdInOrderByCreatedAtAsc(stageIds);
        List<RouteSegmentEventEntity> events = eventRepository.findByStageId(stageIds);
        var photos = photoRepository.findByStageIds(stageIds);

        List<StageMapDTO> stageMaps = stages.stream()
                .map(s -> StageMapDTO.builder()
                        .id(s.getId())
                        .dayNumber(s.getDayNumber())
                        .startLat(s.getStartLat())
                        .startLng(s.getStartLng())
                        .endLat(s.getEndLat())
                        .endLng(s.getEndLng())
                        .country(s.getCountry())
                        .build())
                .collect(Collectors.toList());

        List<SegmentMapDTO> segmentMaps = segments.stream()
                .map(s -> SegmentMapDTO.builder()
                        .id(s.getId())
                        .stageId(s.getStage().getId())
                        .startLat(s.getStartLat())
                        .startLng(s.getStartLng())
                        .endLat(s.getEndLat())
                        .endLng(s.getEndLng())
                        .build())
                .collect(Collectors.toList());

        List<EventMapDTO> eventMaps = events.stream()
                .map(e -> EventMapDTO.builder()
                        .id(e.getId())
                        .type(e.getType().name())
                        .description(e.getDescription())
                        .latitude(e.getLatitude())
                        .longitude(e.getLongitude())
                        .build())
                .collect(Collectors.toList());

        List<PhotoMapDTO> photoMaps = photos.stream()
                .filter(p -> p.getLatitude() != null && p.getLongitude() != null)
                .map(p -> PhotoMapDTO.builder()
                        .id(p.getId())
                        .url(p.getUrl())
                        .latitude(p.getLatitude())
                        .longitude(p.getLongitude())
                        .build())
                .collect(Collectors.toList());

        return MapDataDTO.builder()
                .stages(stageMaps)
                .segments(segmentMaps)
                .events(eventMaps)
                .photos(photoMaps)
                .build();
    }
}
```

---

## 8. Excepciones Personalizadas

### ResourceNotFoundException.java
```java
package com.conpedales.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

### ValidationException.java
```java
package com.conpedales.exception;

public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }
}
```

### GlobalExceptionHandler (actualizado)
```java
package com.conpedales.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "error", "Recurso no encontrado",
                "message", ex.getMessage(),
                "timestamp", LocalDateTime.now()
        ));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(ValidationException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "error", "Error de validación",
                "message", ex.getMessage(),
                "timestamp", LocalDateTime.now()
        ));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "error", "Credenciales inválidas",
                "message", ex.getMessage(),
                "timestamp", LocalDateTime.now()
        ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Error interno",
                "message", ex.getMessage(),
                "timestamp", LocalDateTime.now()
        ));
    }
}
```

---

## 9. Resumen de Servicios

| Servicio | Métodos Principales |
|----------|-------------------|
| StageService | getAllStages, getStageById, createStage, updateStage, deleteStage |
| RouteSegmentService | getSegmentsByStageId, createSegment, updateSegment, deleteSegment |
| RouteSegmentEventService | getEventsBySegmentId, createEvent, deleteEvent |
| PhotoService | getPhotosByStageId, createPhoto, deletePhoto, generateUploadUrl |
| StatsService | getGlobalStats |
| DonationService | getDonationFeed, createCheckoutSession, processSuccessfulPayment, saveComment |
| MapService | getMapData |

---

## 10. Dependencias entre Servicios

```
StageService
  └── StageRepository

RouteSegmentService
  ├── RouteSegmentRepository
  └── StageRepository

RouteSegmentEventService
  ├── RouteSegmentEventRepository
  └── RouteSegmentRepository

PhotoService
  ├── PhotoRepository
  ├── StageRepository
  └── RouteSegmentRepository

StatsService
  ├── StageRepository
  └── DonationRepository

DonationService
  ├── DonationRepository
  ├── CommentRepository
  └── StripeService

MapService
  ├── StageRepository
  ├── RouteSegmentRepository
  ├── RouteSegmentEventRepository
  └── PhotoRepository
```