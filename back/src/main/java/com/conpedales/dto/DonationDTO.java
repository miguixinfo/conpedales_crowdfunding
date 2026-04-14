package com.conpedales.dto;

import com.conpedales.model.DonationEntity;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonationDTO {
    private Long id;
    private String stripePaymentIntent;
    private Integer amount;
    private DonationEntity.DonationStatus status;
    private String donorName;
    private String donorEmail;
    private LocalDateTime createdAt;
    private CommentDTO comment;
}