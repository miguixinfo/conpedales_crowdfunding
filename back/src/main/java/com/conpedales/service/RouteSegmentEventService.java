package com.conpedales.service;

import com.conpedales.dto.*;
import com.conpedales.exception.ResourceNotFoundException;
import com.conpedales.model.RouteSegmentEntity;
import com.conpedales.model.RouteSegmentEventEntity;
import com.conpedales.repository.RouteSegmentEventRepository;
import com.conpedales.repository.RouteSegmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteSegmentEventService {

    private final RouteSegmentEventRepository eventRepository;
    private final RouteSegmentRepository segmentRepository;

    @Transactional(readOnly = true)
    public List<RouteSegmentEventDTO> getEventsBySegmentId(Long segmentId) {
        if (!segmentRepository.existsById(segmentId)) {
            throw new ResourceNotFoundException("Segmento no encontrado: " + segmentId);
        }
        return eventRepository.findBySegmentId(segmentId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public RouteSegmentEventDTO createEvent(Long segmentId, CreateRouteSegmentEventDTO dto) {
        RouteSegmentEntity segment = segmentRepository.findById(segmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Segmento no encontrado: " + segmentId));

        RouteSegmentEventEntity event = RouteSegmentEventEntity.builder()
                .segment(segment)
                .type(dto.getType())
                .description(dto.getDescription())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .build();

        RouteSegmentEventEntity saved = eventRepository.save(event);
        return toDTO(saved);
    }

    @Transactional
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Evento no encontrado: " + id);
        }
        eventRepository.deleteById(id);
    }

    private RouteSegmentEventDTO toDTO(RouteSegmentEventEntity event) {
        return RouteSegmentEventDTO.builder()
                .id(event.getId())
                .segmentId(event.getSegment().getId())
                .type(event.getType())
                .description(event.getDescription())
                .latitude(event.getLatitude())
                .longitude(event.getLongitude())
                .createdAt(event.getCreatedAt())
                .build();
    }
}