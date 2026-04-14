package com.conpedales.controller;

import com.conpedales.dto.StageDTO;
import com.conpedales.service.StageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stages")
@RequiredArgsConstructor
public class StageController {

    private final StageService stageService;

    @GetMapping
    public ResponseEntity<List<StageDTO>> getAllStages() {
        return ResponseEntity.ok(stageService.getPublishedStages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StageDTO> getStageById(@PathVariable Long id) {
        return ResponseEntity.ok(stageService.getStageById(id));
    }

    @GetMapping("/latest")
    public ResponseEntity<StageDTO> getLatestStage() {
        return ResponseEntity.ok(stageService.getLatestStage());
    }
}