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