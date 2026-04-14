package com.conpedales.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponse {
    private String sessionId;
    private String checkoutUrl;
}