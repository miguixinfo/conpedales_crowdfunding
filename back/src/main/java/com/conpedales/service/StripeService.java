package com.conpedales.service;

import com.conpedales.dto.CheckoutResponse;
import com.conpedales.dto.CreateCheckoutDTO;
import com.conpedales.model.DonationEntity;
import com.conpedales.repository.DonationRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StripeService {

    private final DonationRepository donationRepository;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @Value("${app.base.url:http://localhost:8080}")
    private String baseUrl;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    public CheckoutResponse createCheckoutSession(CreateCheckoutDTO dto) throws StripeException {
        DonationEntity donation = DonationEntity.builder()
                .amount(dto.getAmount())
                .donorName(dto.getName())
                .donorEmail(dto.getEmail())
                .status(DonationEntity.DonationStatus.PENDING)
                .stripeSessionId(UUID.randomUUID().toString())
                .build();
        donationRepository.save(donation);

        String successUrl = dto.getSuccessUrl() != null ? dto.getSuccessUrl() : baseUrl + "/donation/success";
        String cancelUrl = dto.getCancelUrl() != null ? dto.getCancelUrl() : baseUrl + "/donation/cancel";

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("eur")
                                .setUnitAmount((long) dto.getAmount() * 100)
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName("Donación ConPedales")
                                        .build())
                                .build())
                        .setQuantity(1L)
                        .build())
                .setSuccessUrl(successUrl + "?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(cancelUrl)
                .setClientReferenceId(donation.getId().toString())
                .build();

        Session session = Session.create(params);

        return CheckoutResponse.builder()
                .sessionId(session.getId())
                .checkoutUrl(session.getUrl())
                .build();
    }

    public DonationEntity processSuccessfulPayment(String sessionId, String paymentIntentId) {
        Session session;
        try {
            session = Session.retrieve(sessionId);
        } catch (StripeException e) {
            throw new RuntimeException("Error retrieving Stripe session: " + e.getMessage());
        }

        String clientReferenceId = session.getClientReferenceId();
        if (clientReferenceId == null) {
            throw new RuntimeException("No client reference ID found");
        }

        Long donationId = Long.parseLong(clientReferenceId);
        return donationRepository.findById(donationId)
                .map(donation -> {
                    donation.setStripePaymentIntent(paymentIntentId);
                    donation.setStatus(DonationEntity.DonationStatus.COMPLETED);
                    return donationRepository.save(donation);
                })
                .orElseThrow(() -> new RuntimeException("Donation not found: " + donationId));
    }

    public void handleCheckoutSessionCompleted(com.stripe.model.Event event) {
        com.stripe.model.checkout.Session session = (com.stripe.model.checkout.Session) event.getDataObjectDeserializer().getObject()
                .orElseThrow(() -> new RuntimeException("Invalid session data"));
        
        String clientReferenceId = session.getClientReferenceId();
        if (clientReferenceId == null) {
            return;
        }

        Long donationId = Long.parseLong(clientReferenceId);
        donationRepository.findById(donationId).ifPresent(donation -> {
            donation.setStatus(DonationEntity.DonationStatus.COMPLETED);
            donation.setStripePaymentIntent(session.getPaymentIntent());
            donationRepository.save(donation);
        });
    }
}