package com.conpedales.controller;

import com.conpedales.dto.RouteSegmentDTO;
import com.conpedales.service.RouteSegmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/segments")
@RequiredArgsConstructor
public class SegmentController {

    private final RouteSegmentService segmentService;

    @GetMapping("/stage/{stageId}")
    public ResponseEntity<List<RouteSegmentDTO>> getSegmentsByStageId(@PathVariable Long stageId) {
        return ResponseEntity.ok(segmentService.getSegmentsByStageId(stageId));
    }
}