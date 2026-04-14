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