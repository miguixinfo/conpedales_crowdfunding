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