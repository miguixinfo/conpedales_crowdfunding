package com.conpedales.service;

import com.conpedales.dto.StatsDTO;
import com.conpedales.model.StageEntity;
import com.conpedales.repository.DonationRepository;
import com.conpedales.repository.StageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final StageRepository stageRepository;
    private final DonationRepository donationRepository;

    @Transactional(readOnly = true)
    public StatsDTO getGlobalStats() {
        List<StageEntity> publishedStages = stageRepository.findAllByIsPublishedTrueOrderByDayNumberAsc();

        Long totalKm = publishedStages.stream()
                .mapToLong(s -> s.getKm().longValue())
                .sum();

        Long totalElevation = publishedStages.stream()
                .mapToLong(s -> s.getElevationGain().longValue())
                .sum();

        Integer totalStages = publishedStages.size();

        Long totalFunded = donationRepository.sumCompletedAmount();

        Long totalDonations = donationRepository.countCompleted();

        Long totalDonors = donationRepository.countUniqueDonors();

        return StatsDTO.builder()
                .totalKm(totalKm)
                .totalElevation(totalElevation)
                .totalStages(totalStages)
                .totalFunded(totalFunded != null ? totalFunded : 0L)
                .totalDonations(totalDonations != null ? totalDonations.intValue() : 0)
                .totalDonors(totalDonors != null ? totalDonors.intValue() : 0)
                .build();
    }
}