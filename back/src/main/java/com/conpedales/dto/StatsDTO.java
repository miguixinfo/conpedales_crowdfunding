package com.conpedales.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatsDTO {
    private Long totalKm;
    private Long totalElevation;
    private Integer totalStages;
    private Integer totalDonations;
    private Long totalFunded;
    private Integer totalDonors;
}