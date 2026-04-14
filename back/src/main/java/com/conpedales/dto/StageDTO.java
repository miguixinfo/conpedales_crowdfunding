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