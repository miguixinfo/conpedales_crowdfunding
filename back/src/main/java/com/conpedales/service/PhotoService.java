package com.conpedales.service;

import com.conpedales.dto.*;
import com.conpedales.exception.ResourceNotFoundException;
import com.conpedales.model.PhotoEntity;
import com.conpedales.model.RouteSegmentEntity;
import com.conpedales.model.StageEntity;
import com.conpedales.repository.PhotoRepository;
import com.conpedales.repository.RouteSegmentRepository;
import com.conpedales.repository.StageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final StageRepository stageRepository;
    private final RouteSegmentRepository segmentRepository;
    private final R2Service r2Service;

    @Transactional(readOnly = true)
    public List<PhotoDTO> getPhotosByStageId(Long stageId) {
        return photoRepository.findByStageId(stageId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PhotoDTO> getAllPhotos() {
        return photoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PhotoDTO getPhotoById(Long id) {
        PhotoEntity photo = photoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Foto no encontrada: " + id));
        return toDTO(photo);
    }

    @Transactional
    public PhotoDTO createPhoto(CreatePhotoDTO dto) {
        StageEntity stage = null;
        RouteSegmentEntity segment = null;

        if (dto.getStageId() != null) {
            stage = stageRepository.findById(dto.getStageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Etapa no encontrada: " + dto.getStageId()));
        }
        if (dto.getSegmentId() != null) {
            segment = segmentRepository.findById(dto.getSegmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Segmento no encontrado: " + dto.getSegmentId()));
        }

        if (dto.getIsHighlight() != null && dto.getIsHighlight()) {
            if (stage != null) {
                photoRepository.findByStageIdAndIsHighlightTrue(stage.getId())
                        .forEach(p -> {
                            p.setIsHighlight(false);
                            photoRepository.save(p);
                        });
            }
        }

        PhotoEntity photo = PhotoEntity.builder()
                .stage(stage)
                .segment(segment)
                .url(dto.getUrl())
                .caption(dto.getCaption())
                .takenAt(dto.getTakenAt())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .isHighlight(dto.getIsHighlight() != null ? dto.getIsHighlight() : false)
                .build();

        PhotoEntity saved = photoRepository.save(photo);
        return toDTO(saved);
    }

    @Transactional
    public PhotoDTO updatePhoto(Long id, UpdatePhotoDTO dto) {
        PhotoEntity photo = photoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Foto no encontrada: " + id));

        if (dto.getCaption() != null) {
            photo.setCaption(dto.getCaption());
        }
        if (dto.getIsHighlight() != null) {
            if (dto.getIsHighlight() && photo.getStage() != null) {
                photoRepository.findByStageIdAndIsHighlightTrue(photo.getStage().getId())
                        .forEach(p -> {
                            p.setIsHighlight(false);
                            photoRepository.save(p);
                        });
            }
            photo.setIsHighlight(dto.getIsHighlight());
        }

        PhotoEntity saved = photoRepository.save(photo);
        return toDTO(saved);
    }

    @Transactional
    public void deletePhoto(Long id) {
        if (!photoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Foto no encontrada: " + id);
        }
        photoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<PhotoDTO> getHighlightPhotos() {
        return photoRepository.findAllHighlights()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UploadUrlResponse generateUploadUrl(String contentType) {
        String folder = "photos";
        if (contentType != null && contentType.startsWith("video/")) {
            folder = "videos";
        }
        
        try {
            var urls = r2Service.generatePresignedUploadUrl(contentType, folder);
            
            return UploadUrlResponse.builder()
                    .uploadUrl(urls.get("uploadUrl"))
                    .fileUrl(urls.get("fileUrl"))
                    .key(urls.get("key"))
                    .build();
        } catch (Exception e) {
            log.error("Error generando presigned URL: {}", e.getMessage(), e);
            throw new RuntimeException("Error al generar URL de subida: " + e.getMessage(), e);
        }
    }

    public UploadUrlResponse generateUploadUrl() {
        return generateUploadUrl("image/jpeg");
    }

    private PhotoDTO toDTO(PhotoEntity photo) {
        return PhotoDTO.builder()
                .id(photo.getId())
                .stageId(photo.getStage() != null ? photo.getStage().getId() : null)
                .segmentId(photo.getSegment() != null ? photo.getSegment().getId() : null)
                .url(photo.getUrl())
                .caption(photo.getCaption())
                .takenAt(photo.getTakenAt())
                .latitude(photo.getLatitude())
                .longitude(photo.getLongitude())
                .isHighlight(photo.getIsHighlight())
                .createdAt(photo.getCreatedAt())
                .build();
    }
}