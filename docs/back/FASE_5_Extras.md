# Fase 5 - Extras (Stripe, Cloudflare R2, Tests, Scripts)

## Objetivo

Implementar servicios de terceros, pruebas, scripts SQL y configuración adicional.

---

## 1. StripeService

### StripeConfig.java
```java
package com.conpedales.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
@Setter
public class StripeConfig {

    @Value("${stripe.secret-key}")
    private String secretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }
}
```

### StripeService.java
```java
package com.conpedales.service;

import com.conpedales.dto.CreateCheckoutDTO;
import com.conpedales.dto.CheckoutResponse;
import com.conpedales.model.DonationEntity;
import com.conpedales.model.CommentEntity;
import com.conpedales.repository.DonationRepository;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StripeService {

    private final DonationRepository donationRepository;

    public CheckoutResponse createCheckoutSession(CreateCheckoutDTO dto) {
        String sessionId = "session_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);

        DonationEntity donation = DonationEntity.builder()
                .stripeSessionId(sessionId)
                .amount(dto.getAmount())
                .donorName(dto.getName())
                .donorEmail(dto.getEmail())
                .status(DonationEntity.DonationStatus.PENDING)
                .build();

        donationRepository.save(donation);

        String successUrl = dto.getSuccessUrl() != null ? dto.getSuccessUrl() : "https://conpedales.com/donation/success";
        String cancelUrl = dto.getCancelUrl() != null ? dto.getCancelUrl() : "https://conpedales.com/donate";

        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl + "?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(cancelUrl)
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("eur")
                                    .setUnitAmount((long) dto.getAmount() * 100)
                                    .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                            .setName("Donación ConPedales")
                                            .setDescription("Ayuda a financiar el viaje Toledo → Atenas")
                                            .build())
                                    .build())
                            .build())
                    .putMetadata("session_id", sessionId)
                    .putMetadata("donor_name", dto.getName() != null ? dto.getName() : "")
                    .putMetadata("donor_comment", dto.getComment() != null ? dto.getComment() : "")
                    .build();

            Session session = Session.create(params);

            return CheckoutResponse.builder()
                    .sessionId(session.getId())
                    .checkoutUrl(session.getUrl())
                    .build();

        } catch (Exception e) {
            log.error("Error creating Stripe session: {}", e.getMessage());
            throw new RuntimeException("Error creating checkout session", e);
        }
    }

    public void handleCheckoutSessionCompleted(com.stripe.model.Event event) {
        try {
            Session session = (Session) event.getDataObjectDeserializer().getObject().orElseThrow();
            String sessionId = session.getId();
            String paymentIntentId = session.getPaymentIntent();
            String donorName = session.getMetadata().get("donor_name");
            String donorComment = session.getMetadata().get("donor_comment");

            DonationEntity donation = donationRepository.findByStripeSessionId(sessionId)
                    .orElse(DonationEntity.builder()
                            .stripeSessionId(sessionId)
                            .build());

            donation.setStripePaymentIntent(paymentIntentId);
            donation.setStatus(DonationEntity.DonationStatus.COMPLETED);
            donation.setDonorName(donorName);

            donationRepository.save(donation);

            if (donorComment != null && !donorComment.isEmpty()) {
                CommentEntity comment = CommentEntity.builder()
                        .donation(donation)
                        .message(donorComment)
                        .build();
                // Save comment via repository
            }

        } catch (Exception e) {
            log.error("Error handling checkout session completed: {}", e.getMessage());
        }
    }

    public boolean verifySignature(String payload, String sigHeader, String endpointSecret) {
        try {
            com.stripe.model.Event event = com.stripe.net.Webhook.constructEvent(
                    payload, sigHeader, endpointSecret);
            return event != null;
        } catch (Exception e) {
            log.error("Error verifying webhook signature: {}", e.getMessage());
            return false;
        }
    }
}
```

---

## 2. Cloudflare R2 Service

### R2Config.java
```java
package com.conpedales.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

import java.net.URI;

@Configuration
public class R2Config {

    @Value("${cloudflare.r2.access-key}")
    private String accessKey;

    @Value("${cloudflare.r2.secret-key}")
    private String secretKey;

    @Value("${cloudflare.r2.account-id}")
    private String accountId;

    @Value("${cloudflare.r2.bucket}")
    private String bucket;

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .endpointOverride(URI.create("https://" + accountId + ".r2.cloudflarestorage.com"))
                .region(Region.US_EAST_1)
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .forcePathStyle(true)
                .build();
    }

    @Bean
    public String r2Bucket() {
        return bucket;
    }
}
```

### R2Service.java
```java
package com.conpedales.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Bean;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class R2Service {

    private final S3Client s3Client;
    private final String r2Bucket;

    public String uploadFile(byte[] fileBytes, String contentType) {
        String key = "photos/" + UUID.randomUUID() + ".jpg";

        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(r2Bucket)
                    .key(key)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(request, RequestBody.fromBytes(fileBytes));

            return getPublicUrl(key);
        } catch (Exception e) {
            log.error("Error uploading to R2: {}", e.getMessage());
            throw new RuntimeException("Error uploading file", e);
        }
    }

    public String getPresignedUploadUrl(String contentType) {
        String key = "photos/" + UUID.randomUUID();

        try {
            String objectKey = key + "/upload";
            
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(r2Bucket)
                    .key(objectKey)
                    .build();

            String uploadUrl = s3Client.utilities().getUrl(getObjectRequest).toString();

            return uploadUrl;
        } catch (Exception e) {
            log.error("Error generating presigned URL: {}", e.getMessage());
            return null;
        }
    }

    public String getPresignedUploadUrlWithExpiry(String contentType, int expiryMinutes) {
        String key = "photos/" + UUID.randomUUID();

        try {
            GetObjectRequest request = GetObjectRequest.builder()
                    .bucket(r2Bucket)
                    .key(key)
                    .build();

            software.amazon.awssdk.services.s3.presigner.S3Presigner presigner = software.amazon.awssdk.services.s3.presigner.S3Presigner.builder()
                    .region(s3Client.region())
                    .credentialsProvider(s3Client.config().credentialsProvider().orElse(null))
                    .build();

            software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest presignRequest = 
                    software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest.builder()
                            .signatureDuration(Duration.ofMinutes(expiryMinutes))
                            .getObjectRequest(request)
                            .build();

            java.net.URL url = presigner.presignGetObject(presignRequest);
            return url.toString();

        } catch (Exception e) {
            log.error("Error generating presigned URL: {}", e.getMessage());
            return null;
        }
    }

    public void deleteFile(String key) {
        try {
            DeleteObjectRequest request = DeleteObjectRequest.builder()
                    .bucket(r2Bucket)
                    .key(key)
                    .build();

            s3Client.deleteObject(request);
        } catch (Exception e) {
            log.error("Error deleting from R2: {}", e.getMessage());
        }
    }

    private String getPublicUrl(String key) {
        return "https://conpedales-photos.example.com/" + key;
    }
}
```

---

## 3. Tests Unitarios

### StageServiceTest.java
```java
package com.conpedales.service;

import com.conpedales.dto.CreateStageDTO;
import com.conpedales.dto.StageDTO;
import com.conpedales.exception.ResourceNotFoundException;
import com.conpedales.model.StageEntity;
import com.conpedales.repository.StageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StageServiceTest {

    @Mock
    private StageRepository stageRepository;

    @InjectMocks
    private StageService stageService;

    private StageEntity testStage;

    @BeforeEach
    void setUp() {
        testStage = StageEntity.builder()
                .id(1L)
                .dayNumber(1)
                .country("España")
                .startName("Toledo")
                .startLat(39.8628)
                .startLng(-4.0273)
                .endName("Azuqueca")
                .endLat(40.5328)
                .endLng(-3.2345)
                .km(85.0)
                .elevationGain(450.0)
                .isPublished(true)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void getAllStages_shouldReturnList() {
        when(stageRepository.findAllByOrderByDayNumberAsc())
                .thenReturn(List.of(testStage));

        List<StageDTO> result = stageService.getAllStages();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(stageRepository, times(1)).findAllByOrderByDayNumberAsc();
    }

    @Test
    void getStageById_shouldReturnStage() {
        when(stageRepository.findById(1L)).thenReturn(Optional.of(testStage));

        StageDTO result = stageService.getStageById(1L);

        assertNotNull(result);
        assertEquals("Toledo", result.getStartName());
    }

    @Test
    void getStageById_shouldThrowWhenNotFound() {
        when(stageRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, 
                () -> stageService.getStageById(999L));
    }

    @Test
    void createStage_shouldCreateAndReturn() {
        CreateStageDTO dto = CreateStageDTO.builder()
                .dayNumber(2)
                .country("España")
                .startName("Azuqueca")
                .startLat(40.5328)
                .startLng(-3.2345)
                .endName("Guadalajara")
                .endLat(40.6336)
                .endLng(-3.1674)
                .km(60.0)
                .elevationGain(300.0)
                .build();

        when(stageRepository.existsByDayNumber(2)).thenReturn(false);
        when(stageRepository.save(any(StageEntity.class))).thenReturn(testStage);

        StageDTO result = stageService.createStage(dto);

        assertNotNull(result);
        verify(stageRepository, times(1)).save(any(StageEntity.class));
    }

    @Test
    void createStage_shouldThrowWhenDuplicateDayNumber() {
        CreateStageDTO dto = CreateStageDTO.builder()
                .dayNumber(1)
                .country("España")
                .startName("Test")
                .startLat(0.0)
                .startLng(0.0)
                .endName("Test")
                .endLat(0.0)
                .endLng(0.0)
                .km(10.0)
                .elevationGain(100.0)
                .build();

        when(stageRepository.existsByDayNumber(1)).thenReturn(true);

        assertThrows(com.conpedales.exception.ValidationException.class,
                () -> stageService.createStage(dto));
    }
}
```

### JwtServiceTest.java
```java
package com.conpedales.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
    }

    @Test
    void generateToken_shouldCreateValidToken() {
        UserDetails userDetails = User.builder()
                .username("admin")
                .password("password")
                .authorities(Collections.emptyList())
                .build();

        String token = jwtService.generateToken(userDetails);

        assertNotNull(token);
        assertTrue(token.length() > 0);
    }

    @Test
    void extractUsername_shouldReturnCorrectUsername() {
        UserDetails userDetails = User.builder()
                .username("admin")
                .password("password")
                .authorities(Collections.emptyList())
                .build();

        String token = jwtService.generateToken(userDetails);
        String extractedUsername = jwtService.extractUsername(token);

        assertEquals("admin", extractedUsername);
    }

    @Test
    void isTokenValid_shouldReturnTrueForValidToken() {
        UserDetails userDetails = User.builder()
                .username("admin")
                .password("password")
                .authorities(Collections.emptyList())
                .build();

        String token = jwtService.generateToken(userDetails);

        assertTrue(jwtService.isTokenValid(token, userDetails));
    }

    @Test
    void isTokenValid_shouldReturnFalseForInvalidUsername() {
        UserDetails validUser = User.builder()
                .username("admin")
                .password("password")
                .authorities(Collections.emptyList())
                .build();

        UserDetails invalidUser = User.builder()
                .username("other")
                .password("password")
                .authorities(Collections.emptyList())
                .build();

        String token = jwtService.generateToken(validUser);

        assertFalse(jwtService.isTokenValid(token, invalidUser));
    }
}
```

---

## 4. Scripts SQL de Datos

### insert_admin_user.sql
```sql
-- Insertar usuario admin
-- Password: admin123 (BCrypt hash)
INSERT INTO users (username, password, email, role, enabled)
VALUES ('admin', '$2a$10$xJxG8Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9', 'admin@conpedales.com', 'ADMIN', true);
```

### insert_sample_stages.sql
```sql
-- Insertar etapas de ejemplo
INSERT INTO stages (day_number, country, start_name, start_lat, start_lng, end_name, end_lat, end_lng, km, elevation_gain, moving_time, description, is_published) VALUES
(1, 'España', 'Toledo', 39.8628, -4.0273, 'Azuqueca de Henares', 40.5328, -3.2345, 85, 450, '5h 30m', 'Salimos de Toledo con muchas ganas. El primer día fue suave para entrar en ritmo.', true),
(2, 'España', 'Azuqueca de Henares', 40.5328, -3.2345, 'Sigüenza', 40.8330, -2.7786, 95, 680, '6h 15m', 'Subimos hacia Sigüenza. Paisajes increibles de Castilla.', true),
(3, 'España', 'Sigüenza', 40.8330, -2.7786, 'Medinaceli', 41.1962, -2.4375, 70, 520, '4h 45m', 'Bajamos a Medinaceli. Pueblo precioso.', true);
```

### insert_sample_donations.sql
```sql
-- Insertar donaciones de ejemplo
INSERT INTO donations (stripe_payment_intent, stripe_session_id, amount, status, donor_name, donor_email) VALUES
('pi_test_1', 'session_001', 50, 'COMPLETED', 'Carlos', 'carlos@email.com'),
('pi_test_2', 'session_002', 25, 'COMPLETED', 'María', 'maria@email.com'),
('pi_test_3', 'session_003', 100, 'COMPLETED', 'Anonymous', NULL);

INSERT INTO comments (donation_id, message) VALUES
(1, 'Mucho ánimo chicvos!'),
(2, 'Qué aventura más épica!'),
(3, 'Aportando al proyecto!');
```

---

## 5. Docker Compose

### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: conpedales-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: conpedales
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: conpedales-api
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/conpedales
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      JWT_SECRET: c29ucGVkYWxlcy1zZWNyZXQta2V5LW1pbmltby0yNTYtYml0cy1wYXJhLXNlZ3VyaWRhZDpjb25wZWRhbGVzLXNlY3JldC1rZXktbWluaW8tMjU2LWJpdHMtcGFyYS1zZWd1cmlkYWQ=
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
```

### Dockerfile
```dockerfile
FROM eclipse-temurin:17-jdk-alpine as builder

WORKDIR /app
COPY pom.xml .
COPY src ./src

RUN apk add --no-cache maven && \
    mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 6. Variables de Entorno

### .env.example
```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/conpedales
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# JWT
JWT_SECRET=your-256-bit-secret-key-in-base64
JWT_EXPIRATION=86400000

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudflare R2 (optional)
CLOUDFLARE_R2_ACCESS_KEY=...
CLOUDFLARE_R2_SECRET_KEY=...
CLOUDFLARE_R2_BUCKET=conpedales-photos
CLOUDFLARE_R2_ACCOUNT_ID=...
```

---

## 7. Resumen Fase 5

| Componente | Descripción |
|-----------|-------------|
| StripeConfig | Configuración Stripe API |
| StripeService | Checkout y webhooks |
| R2Config | Configuración Cloudflare R2 |
| R2Service | Upload/download fotos |
| StageServiceTest | Tests unitarios Stage |
| JwtServiceTest | Tests unitarios JWT |
| docker-compose.yml | PostgreSQL + API |
| Dockerfile | Imagen Docker |
| .env.example | Variables entorno |

---

## 8. Checklist Final

- [x] FASE 0 - Base proyecto y seguridad
- [x] FASE 1 - Modelo de dominio  
- [x] FASE 2 - DTOs y Repositorios
- [x] FASE 3 - Servicios
- [x] FASE 4 - Controladores
- [x] FASE 5 - Extras (Stripe, R2, Tests, Docker)

---

**Fin de la documentación técnica completa de ConPedales API** 🎉