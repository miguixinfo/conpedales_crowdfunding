package com.conpedales.dto;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhotoDTO {
    private Long id;
    private Long stageId;
    private Long segmentId;
    private String url;
    private String caption;
    private LocalDateTime takenAt;
    private Double latitude;
    private Double longitude;
    private Boolean isHighlight;
    private LocalDateTime createdAt;
}