package com.conpedales.repository;

import com.conpedales.model.RouteSegmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteSegmentRepository extends JpaRepository<RouteSegmentEntity, Long> {

    List<RouteSegmentEntity> findByStageIdOrderByCreatedAtAsc(Long stageId);

    List<RouteSegmentEntity> findByStageIdInOrderByCreatedAtAsc(List<Long> stageIds);
}