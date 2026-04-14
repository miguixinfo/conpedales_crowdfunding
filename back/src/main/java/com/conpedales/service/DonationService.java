package com.conpedales.service;

import com.conpedales.dto.*;
import com.conpedales.exception.ResourceNotFoundException;
import com.conpedales.exception.StripeCheckoutException;
import com.conpedales.model.DonationEntity;
import com.conpedales.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;
    private final StripeService stripeService;

    @Transactional(readOnly = true)
    public List<DonationFeedDTO> getDonationFeed() {
        return donationRepository.findAllByStatusOrderByCreatedAtDesc(DonationEntity.DonationStatus.COMPLETED)
                .stream()
                .map(donation -> DonationFeedDTO.builder()
                        .name(donation.getDonorName())
                        .amount(donation.getAmount())
                        .comment(donation.getComment())
                        .date(donation.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public CheckoutResponse createCheckoutSession(CreateCheckoutDTO dto) {
        try {
            return stripeService.createCheckoutSession(dto);
        } catch (com.stripe.exception.StripeException e) {
            throw new StripeCheckoutException("Error al crear sesión de pago: " + e.getMessage());
        }
    }

    @Transactional
    public DonationEntity processSuccessfulPayment(String sessionId, String paymentIntentId) {
        return stripeService.processSuccessfulPayment(sessionId, paymentIntentId);
    }



    @Transactional(readOnly = true)
    public DonationDTO getDonationById(Long id) {
        DonationEntity donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donación no encontrada: " + id));
        return toDTO(donation);
    }

    private DonationDTO toDTO(DonationEntity donation) {
        return DonationDTO.builder()
                .id(donation.getId())
                .stripePaymentIntent(donation.getStripePaymentIntent())
                .amount(donation.getAmount())
                .status(donation.getStatus())
                .donorName(donation.getDonorName())
                .donorEmail(donation.getDonorEmail())
                .createdAt(donation.getCreatedAt())
                .build();
    }
}