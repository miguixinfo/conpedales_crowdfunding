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
    private RouteSegmentEventEntity.EventType type;
    private String description;
    private Double latitude;
    private Double longitude;
}