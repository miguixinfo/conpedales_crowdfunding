package com.conpedales.controller;

import com.conpedales.dto.CreateRouteSegmentDTO;
import com.conpedales.dto.RouteSegmentDTO;
import com.conpedales.service.RouteSegmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/segments")
@RequiredArgsConstructor
public class AdminSegmentController {

    private final RouteSegmentService segmentService;

    @GetMapping("/{id}")
    public ResponseEntity<RouteSegmentDTO> getSegmentById(@PathVariable Long id) {
        return ResponseEntity.ok(segmentService.getSegmentById(id));
    }

    @PostMapping
    public ResponseEntity<RouteSegmentDTO> createSegment(@Valid @RequestBody CreateRouteSegmentDTO dto) {
        return ResponseEntity.ok(segmentService.createSegment(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RouteSegmentDTO> updateSegment(@PathVariable Long id, @Valid @RequestBody CreateRouteSegmentDTO dto) {
        return ResponseEntity.ok(segmentService.updateSegment(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSegment(@PathVariable Long id) {
        segmentService.deleteSegment(id);
        return ResponseEntity.noContent().build();
    }
}