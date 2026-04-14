package com.conpedales.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePhotoDTO {
    private String caption;

    private Boolean isHighlight;
}