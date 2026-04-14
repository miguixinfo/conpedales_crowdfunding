# Fase 1 - Modelo de Dominio

## Objetivo

Crear todas las entidades JPA del sistema que representan las 6 entidades principales del dominio.

---

## 1. Diagrama de Entidades

```
┌─────────────┐       ┌──────────────────┐       ┌────────────────────┐
│   Stage     │       │  RouteSegment    │       │ RouteSegmentEvent  │
├─────────────┤       ├──────────────────┤       ├────────────────────┤
│ id          │──┐    │ id               │──┐    │ id                 │
│ day_number  │  │    │ stage_id (FK)    │  │    │ route_segment_id   │
│ country    │  │    │ start_name       │  │    │ type              │
│ start_name │  │    │ end_name        │  │    │ description       │
│ start_lat  │  │    │ start_lat/lng   │  │    │ latitude/longitude │
│ start_lng   │  │    │ end_lat/lng     │──┘    │ created_at        │
│ end_name   │  │    │ km             │       └────────────────────┘
│ end_lat/lng│  │    │ elevation_gain │
│ km         │  │    │ created_at    │
│ elevation  │  │    └──────────────────┘
│ moving_time│  │
│ description│ │
│ created_at │  │
└─────────────┘  │
       │         │
       │         │
       │         │
       ▼         ▼
┌─────────────┐       ┌─────────────────┐
│    Photo   │       │   Donation      │
├─────────────┤       ├─────────────────┤
│ id         │       │ id              │
│ stage_id   │       │ stripe_payment │
│ segment_id│       │ amount         │
│ url       │       │ donor_name     │
│ caption  │       │ created_at    │
│ taken_at  │       └─────────────────┘
│ created_at│               │
└─────────────┘               │
       │                    │
       │                    │
       ▼                    ▼
       ┌─────────────────┐
       │    Comment     │
       ├─────────────────┤
       │ id             │
       │ donation_id (FK)│
       │ message        │
       │ created_at     │
       └─────────────────┘
```

---

## 2. StageEntity - Etapas del viaje

```java
package com.conpedales.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "day_number", nullable = false)
    private Integer dayNumber;

    @Column(nullable = false)
    private String country;

    @Column(name = "start_name", nullable = false)
    private String startName;

    @Column(name = "start_lat", nullable = false)
    private Double startLat;

    @Column(name = "start_lng", nullable = false)
    private Double startLng;

    @Column(name = "end_name", nullable = false)
    private String endName;

    @Column(name = "end_lat", nullable = false)
    private Double endLat;

    @Column(name = "end_lng", nullable = false)
    private Double endLng;

    @Column(nullable = false)
    private Double km;

    @Column(name = "elevation_gain", nullable = false)
    private Double elevationGain;

    @Column(name = "moving_time")
    private String movingTime;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_published")
    @Builder.Default
    private Boolean isPublished = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "stage", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RouteSegmentEntity> segments = new ArrayList<>();

    @OneToMany(mappedBy = "stage", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PhotoEntity> photos = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

---

## 3. RouteSegmentEntity - Segmentos/Rutitas

```java
package com.conpedales.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "route_segments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteSegmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stage_id", nullable = false)
    private StageEntity stage;

    @Column(name = "start_name", nullable = false)
    private String startName;

    @Column(name = "end_name", nullable = false)
    private String endName;

    @Column(name = "start_lat", nullable = false)
    private Double startLat;

    @Column(name = "start_lng", nullable = false)
    private Double startLng;

    @Column(name = "end_lat", nullable = false)
    private Double endLat;

    @Column(name = "end_lng", nullable = false)
    private Double endLng;

    @Column(nullable = false)
    private Double km;

    @Column(name = "elevation_gain", nullable = false)
    private Double elevationGain;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "segment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RouteSegmentEventEntity> events = new ArrayList<>();

    @OneToMany(mappedBy = "segment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PhotoEntity> photos = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

---

## 4. RouteSegmentEventEntity - Eventos en segmentos

```java
package com.conpedales.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "route_segment_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteSegmentEventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_segment_id", nullable = false)
    private RouteSegmentEntity segment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType type;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum EventType {
        PUNCTURE,      // Pinchazo
        MECHANICAL,   // Problema mecánico
        SOCIAL,       // Interacción social
        FOOD,        // Comida
        VIEWPOINT,    // Paisaje
        WEATHER,      // Clima
        OTHER        // Otro
    }
}
```

---

## 5. PhotoEntity - Fotos del viaje

```java
package com.conpedales.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "photos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhotoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stage_id")
    private StageEntity stage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "segment_id")
    private RouteSegmentEntity segment;

    @Column(nullable = false)
    private String url;

    @Column
    private String caption;

    @Column(name = "taken_at")
    private LocalDateTime takenAt;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "is_highlight")
    @Builder.Default
    private Boolean isHighlight = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (takenAt == null) {
            takenAt = LocalDateTime.now();
        }
    }
}
```

---

## 6. DonationEntity - Donaciones

```java
package com.conpedales.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "donations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stripe_payment_intent")
    private String stripePaymentIntent;

    @Column(name = "stripe_session_id")
    private String stripeSessionId;

    @Column(nullable = false)
    private Integer amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private DonationStatus status = DonationStatus.PENDING;

    @Column(name = "donor_name")
    private String donorName;

    @Column(name = "donor_email")
    private String donorEmail;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "donation", cascade = CascadeType.ALL, orphanRemoval = true)
    private CommentEntity comment;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum DonationStatus {
        PENDING,
        COMPLETED,
        FAILED,
        REFUNDED
    }
}
```

---

## 7. CommentEntity - Comentarios de donantes

```java
package com.conpedales.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donation_id", nullable = false)
    private DonationEntity donation;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

---

## 8. Stats - Estadísticas (no es entidad, se calcula)

```java
package com.conpedales.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatsDTO {
    private Long totalKm;
    private Long totalElevation;
    private Integer totalStages;
    private Integer totalDonations;
    private Long totalFunded;
    private Integer totalDonors;
}
```

---

## 9. Resumen de Entidades

| Entidad | Tabla | Relaciones |
|--------|------|------------|
| StageEntity | stages | 1:N RouteSegment, 1:N Photo |
| RouteSegmentEntity | route_segments | N:1 Stage, 1:N Event, 1:N Photo |
| RouteSegmentEventEntity | route_segment_events | N:1 RouteSegment |
| PhotoEntity | photos | N:1 Stage, N:1 RouteSegment |
| DonationEntity | donations | 1:1 Comment |
| CommentEntity | comments | N:1 Donation |

---

## 10. Scripts SQL Completos

```sql
-- Tabla stages
CREATE TABLE stages (
    id BIGSERIAL PRIMARY KEY,
    day_number INTEGER NOT NULL UNIQUE,
    country VARCHAR(255) NOT NULL,
    start_name VARCHAR(255) NOT NULL,
    start_lat DOUBLE PRECISION NOT NULL,
    start_lng DOUBLE PRECISION NOT NULL,
    end_name VARCHAR(255) NOT NULL,
    end_lat DOUBLE PRECISION NOT NULL,
    end_lng DOUBLE PRECISION NOT NULL,
    km DOUBLE PRECISION NOT NULL,
    elevation_gain DOUBLE PRECISION NOT NULL,
    moving_time VARCHAR(50),
    description TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla route_segments
CREATE TABLE route_segments (
    id BIGSERIAL PRIMARY KEY,
    stage_id BIGINT NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
    start_name VARCHAR(255) NOT NULL,
    end_name VARCHAR(255) NOT NULL,
    start_lat DOUBLE PRECISION NOT NULL,
    start_lng DOUBLE PRECISION NOT NULL,
    end_lat DOUBLE PRECISION NOT NULL,
    end_lng DOUBLE PRECISION NOT NULL,
    km DOUBLE PRECISION NOT NULL,
    elevation_gain DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla route_segment_events
CREATE TABLE route_segment_events (
    id BIGSERIAL PRIMARY KEY,
    route_segment_id BIGINT NOT NULL REFERENCES route_segments(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla photos
CREATE TABLE photos (
    id BIGSERIAL PRIMARY KEY,
    stage_id BIGINT REFERENCES stages(id) ON DELETE SET NULL,
    segment_id BIGINT REFERENCES route_segments(id) ON DELETE SET NULL,
    url VARCHAR(500) NOT NULL,
    caption TEXT,
    taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_highlight BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla donations
CREATE TABLE donations (
    id BIGSERIAL PRIMARY KEY,
    stripe_payment_intent VARCHAR(255),
    stripe_session_id VARCHAR(255),
    amount INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    donor_name VARCHAR(255),
    donor_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla comments
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    donation_id BIGINT NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_stages_day_number ON stages(day_number);
CREATE INDEX idx_stages_published ON stages(is_published);
CREATE INDEX idx_route_segments_stage ON route_segments(stage_id);
CREATE INDEX idx_route_segment_events_segment ON route_segment_events(route_segment_id);
CREATE INDEX idx_photos_stage ON photos(stage_id);
CREATE INDEX idx_photos_segment ON photos(segment_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created ON donations(created_at);
CREATE INDEX idx_comments_donation ON comments(donation_id);
```