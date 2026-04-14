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