package com.conpedales.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhotoMapDTO {
    private Long id;
    private String url;
    private Double latitude;
    private Double longitude;
}