package com.conpedales.service;

import com.conpedales.dto.*;
import com.conpedales.exception.ResourceNotFoundException;
import com.conpedales.model.RouteSegmentEntity;
import com.conpedales.model.StageEntity;
import com.conpedales.repository.RouteSegmentRepository;
import com.conpedales.repository.StageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteSegmentService {

    private final RouteSegmentRepository segmentRepository;
    private final StageRepository stageRepository;

    @Transactional(readOnly = true)
    public List<RouteSegmentDTO> getSegmentsByStageId(Long stageId) {
        if (!stageRepository.existsById(stageId)) {
            throw new ResourceNotFoundException("Etapa no encontrada: " + stageId);
        }
        return segmentRepository.findByStageIdOrderByCreatedAtAsc(stageId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RouteSegmentDTO getSegmentById(Long id) {
        RouteSegmentEntity segment = segmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Segmento no encontrado: " + id));
        return toDTO(segment);
    }

    @Transactional
    public RouteSegmentDTO createSegment(CreateRouteSegmentDTO dto) {
        StageEntity stage = stageRepository.findById(dto.getStageId())
                .orElseThrow(() -> new ResourceNotFoundException("Etapa no encontrada: " + dto.getStageId()));

        RouteSegmentEntity segment = RouteSegmentEntity.builder()
                .stage(stage)
                .startName(dto.getStartName())
                .startLat(dto.getStartLat())
                .startLng(dto.getStartLng())
                .endName(dto.getEndName())
                .endLat(dto.getEndLat())
                .endLng(dto.getEndLng())
                .km(dto.getKm())
                .elevationGain(dto.getElevationGain())
                .build();

        RouteSegmentEntity saved = segmentRepository.save(segment);
        return toDTO(saved);
    }

    @Transactional
    public RouteSegmentDTO updateSegment(Long id, CreateRouteSegmentDTO dto) {
        RouteSegmentEntity segment = segmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Segmento no encontrado: " + id));

        if (dto.getStartName() != null) segment.setStartName(dto.getStartName());
        if (dto.getStartLat() != null) segment.setStartLat(dto.getStartLat());
        if (dto.getStartLng() != null) segment.setStartLng(dto.getStartLng());
        if (dto.getEndName() != null) segment.setEndName(dto.getEndName());
        if (dto.getEndLat() != null) segment.setEndLat(dto.getEndLat());
        if (dto.getEndLng() != null) segment.setEndLng(dto.getEndLng());
        if (dto.getKm() != null) segment.setKm(dto.getKm());
        if (dto.getElevationGain() != null) segment.setElevationGain(dto.getElevationGain());

        RouteSegmentEntity saved = segmentRepository.save(segment);
        return toDTO(saved);
    }

    @Transactional
    public void deleteSegment(Long id) {
        if (!segmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Segmento no encontrado: " + id);
        }
        segmentRepository.deleteById(id);
    }

    private RouteSegmentDTO toDTO(RouteSegmentEntity segment) {
        return RouteSegmentDTO.builder()
                .id(segment.getId())
                .stageId(segment.getStage().getId())
                .startName(segment.getStartName())
                .startLat(segment.getStartLat())
                .startLng(segment.getStartLng())
                .endName(segment.getEndName())
                .endLat(segment.getEndLat())
                .endLng(segment.getEndLng())
                .km(segment.getKm())
                .elevationGain(segment.getElevationGain())
                .createdAt(segment.getCreatedAt())
                .build();
    }
}