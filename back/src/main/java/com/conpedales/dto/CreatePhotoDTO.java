package com.conpedales.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePhotoDTO {
    private Long stageId;

    private Long segmentId;

    @NotBlank(message = "La URL es obligatoria")
    private String url;

    private String caption;

    private LocalDateTime takenAt;

    private Double latitude;

    private Double longitude;

    @Builder.Default
    private Boolean isHighlight = false;
}