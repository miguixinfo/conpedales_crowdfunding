package com.conpedales.controller;

import com.conpedales.dto.CreateRouteSegmentEventDTO;
import com.conpedales.dto.RouteSegmentEventDTO;
import com.conpedales.service.RouteSegmentEventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/segments")
@RequiredArgsConstructor
public class AdminSegmentEventController {

    private final RouteSegmentEventService eventService;

    @GetMapping("/{segmentId}/events")
    public ResponseEntity<List<RouteSegmentEventDTO>> getEventsBySegmentId(@PathVariable Long segmentId) {
        return ResponseEntity.ok(eventService.getEventsBySegmentId(segmentId));
    }

    @PostMapping("/{segmentId}/events")
    public ResponseEntity<RouteSegmentEventDTO> createEvent(
            @PathVariable Long segmentId,
            @Valid @RequestBody CreateRouteSegmentEventDTO dto) {
        return ResponseEntity.ok(eventService.createEvent(segmentId, dto));
    }

    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }
}