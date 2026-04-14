package com.conpedales.repository;

import com.conpedales.model.PhotoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhotoRepository extends JpaRepository<PhotoEntity, Long> {

    List<PhotoEntity> findByStageId(Long stageId);

    List<PhotoEntity> findBySegmentId(Long segmentId);

    List<PhotoEntity> findByStageIdAndIsHighlightTrue(Long stageId);

    Optional<PhotoEntity> findFirstByIsHighlightTrueOrderByCreatedAtDesc();

    @Query("SELECT p FROM PhotoEntity p WHERE p.stage.id IN :stageIds")
    List<PhotoEntity> findByStageIds(List<Long> stageIds);

    @Query("SELECT p FROM PhotoEntity p WHERE p.isHighlight = true")
    List<PhotoEntity> findAllHighlights();
}