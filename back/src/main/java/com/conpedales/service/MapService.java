package com.conpedales.service;

import com.conpedales.dto.*;
import com.conpedales.model.RouteSegmentEventEntity;
import com.conpedales.model.RouteSegmentEntity;
import com.conpedales.model.StageEntity;
import com.conpedales.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MapService {

    private final StageRepository stageRepository;
    private final RouteSegmentRepository segmentRepository;
    private final RouteSegmentEventRepository eventRepository;
    private final PhotoRepository photoRepository;

    @Transactional(readOnly = true)
    public MapDataDTO getMapData() {
        List<StageEntity> stages = stageRepository.findAllByIsPublishedTrueOrderByDayNumberAsc();
        List<Long> stageIds = stages.stream().map(StageEntity::getId).collect(Collectors.toList());

        List<RouteSegmentEntity> segments = segmentRepository.findByStageIdInOrderByCreatedAtAsc(stageIds);
        List<RouteSegmentEventEntity> events = eventRepository.findByStageIdIn(stageIds);
        var photos = photoRepository.findByStageIds(stageIds);

        List<StageMapDTO> stageMaps = stages.stream()
                .map(s -> StageMapDTO.builder()
                        .id(s.getId())
                        .dayNumber(s.getDayNumber())
                        .startLat(s.getStartLat())
                        .startLng(s.getStartLng())
                        .endLat(s.getEndLat())
                        .endLng(s.getEndLng())
                        .country(s.getCountry())
                        .build())
                .collect(Collectors.toList());

        List<SegmentMapDTO> segmentMaps = segments.stream()
                .map(s -> SegmentMapDTO.builder()
                        .id(s.getId())
                        .stageId(s.getStage().getId())
                        .startLat(s.getStartLat())
                        .startLng(s.getStartLng())
                        .endLat(s.getEndLat())
                        .endLng(s.getEndLng())
                        .build())
                .collect(Collectors.toList());

        List<EventMapDTO> eventMaps = events.stream()
                .map(e -> EventMapDTO.builder()
                        .id(e.getId())
                        .type(e.getType())
                        .description(e.getDescription())
                        .latitude(e.getLatitude())
                        .longitude(e.getLongitude())
                        .build())
                .collect(Collectors.toList());

        List<PhotoMapDTO> photoMaps = photos.stream()
                .filter(p -> p.getLatitude() != null && p.getLongitude() != null)
                .map(p -> PhotoMapDTO.builder()
                        .id(p.getId())
                        .url(p.getUrl())
                        .latitude(p.getLatitude())
                        .longitude(p.getLongitude())
                        .build())
                .collect(Collectors.toList());

        return MapDataDTO.builder()
                .stages(stageMaps)
                .segments(segmentMaps)
                .events(eventMaps)
                .photos(photoMaps)
                .build();
    }
}