package com.conpedales.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SegmentMapDTO {
    private Long id;
    private Long stageId;
    private Double startLat;
    private Double startLng;
    private Double endLat;
    private Double endLng;
}