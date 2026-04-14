package com.conpedales.repository;

import com.conpedales.model.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    Optional<CommentEntity> findByDonationId(Long donationId);

    @Query("SELECT c FROM CommentEntity c WHERE c.donation.status = 'COMPLETED' ORDER BY c.donation.createdAt DESC")
    List<CommentEntity> findAllByDonationStatusCompleted();

    @Query("SELECT c FROM CommentEntity c ORDER BY c.donation.createdAt DESC")
    List<CommentEntity> findAllOrderByCreatedAtDesc();
}