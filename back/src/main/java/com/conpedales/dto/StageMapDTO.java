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