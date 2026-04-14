package com.conpedales.repository;

import com.conpedales.model.StageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StageRepository extends JpaRepository<StageEntity, Long> {

    List<StageEntity> findAllByOrderByDayNumberAsc();

    List<StageEntity> findAllByIsPublishedTrueOrderByDayNumberAsc();

    Optional<StageEntity> findByDayNumber(Integer dayNumber);

    Optional<StageEntity> findTopByIsPublishedTrueOrderByDayNumberDesc();

    boolean existsByDayNumber(Integer dayNumber);

    @Query("SELECT MAX(s.dayNumber) FROM StageEntity s")
    Optional<Integer> findMaxDayNumber();
}