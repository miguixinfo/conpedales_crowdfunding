package com.conpedales.controller;

import com.conpedales.dto.CheckoutResponse;
import com.conpedales.dto.CreateCheckoutDTO;
import com.conpedales.dto.DonationFeedDTO;
import com.conpedales.service.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    @GetMapping("/feed")
    public ResponseEntity<List<DonationFeedDTO>> getDonationFeed() {
        return ResponseEntity.ok(donationService.getDonationFeed());
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> createCheckout(@Valid @RequestBody CreateCheckoutDTO dto) {
        return ResponseEntity.ok(donationService.createCheckoutSession(dto));
    }
}