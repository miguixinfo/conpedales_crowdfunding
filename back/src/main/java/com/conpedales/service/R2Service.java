package com.conpedales.service;

import com.conpedales.config.R2Config;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;

import java.net.URI;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class R2Service {

    private final R2Config r2Config;

    private S3Presigner createPresigner() {
        log.info("Creating S3Presigner for endpoint: {}, bucket: {}",
                r2Config.getEndpoint(), r2Config.getBucketName());

        AwsBasicCredentials credentials = AwsBasicCredentials.create(
                r2Config.getAccessKeyId(),
                r2Config.getSecretAccessKey());

        S3Configuration s3Config = S3Configuration.builder()
                .pathStyleAccessEnabled(true)
                .build();

        return S3Presigner.builder()
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .endpointOverride(URI.create(r2Config.getEndpoint()))
                .region(Region.of("auto"))
                .serviceConfiguration(s3Config)
                .build();
    }

    public Map<String, String> generatePresignedUploadUrl(String contentType, String folder) {
        log.info("Generating presigned URL for contentType: {}, folder: {}", contentType, folder);

        String key = folder + "/" + UUID.randomUUID() + getExtension(contentType);

        try (S3Presigner presigner = createPresigner()) {
            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(r2Config.getBucketName())
                    .key(key)
                    .contentType(contentType)
                    .build();

            PresignedPutObjectRequest presignedRequest = presigner.presignPutObject(
                    request -> request
                            .putObjectRequest(objectRequest)
                            .signatureDuration(Duration.ofMinutes(10)));

            log.info("Generated presigned URL successfully. Key: {}, URL length: {}",
                    key, presignedRequest.url().toString().length());

            String uploadUrl = presignedRequest.url().toString();
            String fileUrl = r2Config.getPublicUrl() + "/" + key;

            log.info("Generated presigned URL. uploadUrl: {}, fileUrl: {}", uploadUrl, fileUrl);

            Map<String, String> result = new HashMap<>();
            result.put("uploadUrl", uploadUrl);
            result.put("fileUrl", fileUrl);
            result.put("key", key);

            return result;
        } catch (Exception e) {
            log.error("Error generating presigned URL: {}", e.getMessage(), e);
            throw new RuntimeException("Error al generar URL de subida: " + e.getMessage(), e);
        }
    }

    private String getExtension(String contentType) {
        if (contentType == null)
            return ".jpg";

        return switch (contentType) {
            case "image/jpeg", "image/jpg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/gif" -> ".gif";
            case "image/webp" -> ".webp";
            case "video/mp4" -> ".mp4";
            case "video/webm" -> ".webm";
            default -> ".jpg";
        };
    }

    public String getPublicUrl(String key) {
        return r2Config.getPublicUrl() + "/" + key;
    }
}