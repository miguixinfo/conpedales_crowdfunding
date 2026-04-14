package com.conpedales.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UploadUrlResponse {
    private String uploadUrl;
    private String fileUrl;
    private String key;
}