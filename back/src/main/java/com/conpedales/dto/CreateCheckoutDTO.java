package com.conpedales.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateCheckoutDTO {
    @NotNull(message = "El amount es obligatorio")
    @Min(value = 1, message = "El mínimo es 1€")
    private Integer amount;

    private String name;

    private String email;

    private String comment;

    private String successUrl;

    private String cancelUrl;
}