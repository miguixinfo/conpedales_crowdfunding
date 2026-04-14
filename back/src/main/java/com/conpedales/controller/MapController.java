package com.conpedales.controller;

import com.conpedales.dto.MapDataDTO;
import com.conpedales.service.MapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/map")
@RequiredArgsConstructor
public class MapController {

    private final MapService mapService;

    @GetMapping
    public ResponseEntity<MapDataDTO> getMapData() {
        return ResponseEntity.ok(mapService.getMapData());
    }
}