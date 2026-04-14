package com.conpedales.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Data;

@Data
@Configuration
@ConfigurationProperties(prefix = "cloudflare.r2")
public class R2Config {
    private String accessKeyId;
    private String secretAccessKey;
    private String bucketName;
    private String endpoint;
    private String publicUrl;
}