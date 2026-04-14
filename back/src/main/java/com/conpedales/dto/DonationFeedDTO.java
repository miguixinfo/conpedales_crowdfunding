package com.conpedales.dto;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonationFeedDTO {
    private String name;
    private Integer amount;
    private String comment;
    private LocalDateTime date;
}