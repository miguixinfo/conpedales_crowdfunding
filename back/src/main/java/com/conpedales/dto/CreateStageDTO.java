package com.conpedales.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateStageDTO {
    @NotNull(message = "El número de día es obligatorio")
    private Integer dayNumber;

    @NotBlank(message = "El país es obligatorio")
    private String country;

    @NotBlank(message = "El nombre de inicio es obligatorio")
    private String startName;

    @NotNull(message = "La latitud de inicio es obligatoria")
    private Double startLat;

    @NotNull(message = "La longitud de inicio es obligatoria")
    private Double startLng;

    @NotBlank(message = "El nombre de fin es obligatorio")
    private String endName;

    @NotNull(message = "La latitud de fin es obligatoria")
    private Double endLat;

    @NotNull(message = "La longitud de fin es obligatoria")
    private Double endLng;

    @NotNull(message = "Los km son obligatorios")
    @Min(value = 0, message = "Los km no pueden ser negativos")
    private Double km;

    @NotNull(message = "El desnivel es obligatorio")
    @Min(value = 0, message = "El desnivel no puede ser negativo")
    private Double elevationGain;

    private String movingTime;

    private String description;

    @Builder.Default
    private Boolean isPublished = false;
}