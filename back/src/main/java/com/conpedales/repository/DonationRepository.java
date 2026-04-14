package com.conpedales.repository;

import com.conpedales.model.DonationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonationRepository extends JpaRepository<DonationEntity, Long> {

    List<DonationEntity> findAllByStatusOrderByCreatedAtDesc(DonationEntity.DonationStatus status);

    Optional<DonationEntity> findByStripeSessionId(String sessionId);

    Optional<DonationEntity> findByStripePaymentIntent(String paymentIntent);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM DonationEntity d WHERE d.status = 'COMPLETED'")
    Long sumCompletedAmount();

    @Query("SELECT COUNT(d) FROM DonationEntity d WHERE d.status = 'COMPLETED'")
    Long countCompleted();

    @Query("SELECT COUNT(DISTINCT COALESCE(NULLIF(d.donorEmail, ''), d.donorName)) FROM DonationEntity d WHERE d.status = 'COMPLETED'")
    Long countUniqueDonors();
}