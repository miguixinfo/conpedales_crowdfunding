package com.conpedales.repository;

import com.conpedales.model.RouteSegmentEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteSegmentEventRepository extends JpaRepository<RouteSegmentEventEntity, Long> {

    List<RouteSegmentEventEntity> findBySegmentId(Long segmentId);

    @Query("SELECT e FROM RouteSegmentEventEntity e WHERE e.segment.stage.id = :stageId")
    List<RouteSegmentEventEntity> findByStageId(Long stageId);

    @Query("SELECT e FROM RouteSegmentEventEntity e WHERE e.segment.stage.id IN :stageIds")
    List<RouteSegmentEventEntity> findByStageIdIn(List<Long> stageIds);
}