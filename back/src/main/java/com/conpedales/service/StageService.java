package com.conpedales.service;

import com.conpedales.dto.*;
import com.conpedales.exception.ResourceNotFoundException;
import com.conpedales.exception.ValidationException;
import com.conpedales.model.StageEntity;
import com.conpedales.repository.StageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StageService {

    private final StageRepository stageRepository;

    @Transactional(readOnly = true)
    public List<StageDTO> getAllStages() {
        return stageRepository.findAllByOrderByDayNumberAsc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StageDTO> getPublishedStages() {
        return stageRepository.findAllByIsPublishedTrueOrderByDayNumberAsc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StageDTO getStageById(Long id) {
        StageEntity stage = stageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Etapa no encontrada: " + id));
        return toDTO(stage);
    }

    @Transactional(readOnly = true)
    public StageDTO getLatestStage() {
        StageEntity stage = stageRepository.findTopByIsPublishedTrueOrderByDayNumberDesc()
                .orElseThrow(() -> new ResourceNotFoundException("No hay etapas publicadas"));
        return toDTO(stage);
    }

    @Transactional
    public StageDTO createStage(CreateStageDTO dto) {
        if (stageRepository.existsByDayNumber(dto.getDayNumber())) {
            throw new ValidationException("Ya existe una etapa con el día: " + dto.getDayNumber());
        }

        StageEntity stage = StageEntity.builder()
                .dayNumber(dto.getDayNumber())
                .country(dto.getCountry())
                .startName(dto.getStartName())
                .startLat(dto.getStartLat())
                .startLng(dto.getStartLng())
                .endName(dto.getEndName())
                .endLat(dto.getEndLat())
                .endLng(dto.getEndLng())
                .km(dto.getKm())
                .elevationGain(dto.getElevationGain())
                .movingTime(dto.getMovingTime())
                .description(dto.getDescription())
                .isPublished(dto.getIsPublished() != null ? dto.getIsPublished() : false)
                .build();

        StageEntity saved = stageRepository.save(stage);
        return toDTO(saved);
    }

    @Transactional
    public StageDTO updateStage(Long id, UpdateStageDTO dto) {
        StageEntity stage = stageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Etapa no encontrada: " + id));

        if (dto.getDayNumber() != null && !dto.getDayNumber().equals(stage.getDayNumber())) {
            if (stageRepository.existsByDayNumber(dto.getDayNumber())) {
                throw new ValidationException("Ya existe una etapa con el día: " + dto.getDayNumber());
            }
            stage.setDayNumber(dto.getDayNumber());
        }
        if (dto.getCountry() != null) stage.setCountry(dto.getCountry());
        if (dto.getStartName() != null) stage.setStartName(dto.getStartName());
        if (dto.getStartLat() != null) stage.setStartLat(dto.getStartLat());
        if (dto.getStartLng() != null) stage.setStartLng(dto.getStartLng());
        if (dto.getEndName() != null) stage.setEndName(dto.getEndName());
        if (dto.getEndLat() != null) stage.setEndLat(dto.getEndLat());
        if (dto.getEndLng() != null) stage.setEndLng(dto.getEndLng());
        if (dto.getKm() != null) stage.setKm(dto.getKm());
        if (dto.getElevationGain() != null) stage.setElevationGain(dto.getElevationGain());
        if (dto.getMovingTime() != null) stage.setMovingTime(dto.getMovingTime());
        if (dto.getDescription() != null) stage.setDescription(dto.getDescription());
        if (dto.getIsPublished() != null) stage.setIsPublished(dto.getIsPublished());

        StageEntity saved = stageRepository.save(stage);
        return toDTO(saved);
    }

    @Transactional
    public void deleteStage(Long id) {
        if (!stageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Etapa no encontrada: " + id);
        }
        stageRepository.deleteById(id);
    }

    private StageDTO toDTO(StageEntity stage) {
        return StageDTO.builder()
                .id(stage.getId())
                .dayNumber(stage.getDayNumber())
                .country(stage.getCountry())
                .startName(stage.getStartName())
                .startLat(stage.getStartLat())
                .startLng(stage.getStartLng())
                .endName(stage.getEndName())
                .endLat(stage.getEndLat())
                .endLng(stage.getEndLng())
                .km(stage.getKm())
                .elevationGain(stage.getElevationGain())
                .movingTime(stage.getMovingTime())
                .description(stage.getDescription())
                .isPublished(stage.getIsPublished())
                .createdAt(stage.getCreatedAt())
                .build();
    }
}