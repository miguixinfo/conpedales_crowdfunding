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