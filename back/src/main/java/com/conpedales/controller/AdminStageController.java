package com.conpedales.controller;

import com.conpedales.dto.CreateStageDTO;
import com.conpedales.dto.StageDTO;
import com.conpedales.dto.UpdateStageDTO;
import com.conpedales.service.StageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/stages")
@RequiredArgsConstructor
public class AdminStageController {

    private final StageService stageService;

    @GetMapping
    public ResponseEntity<List<StageDTO>> getAllStages() {
        return ResponseEntity.ok(stageService.getAllStages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StageDTO> getStageById(@PathVariable Long id) {
        return ResponseEntity.ok(stageService.getStageById(id));
    }

    @PostMapping
    public ResponseEntity<StageDTO> createStage(@Valid @RequestBody CreateStageDTO dto) {
        return ResponseEntity.ok(stageService.createStage(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StageDTO> updateStage(@PathVariable Long id, @Valid @RequestBody UpdateStageDTO dto) {
        return ResponseEntity.ok(stageService.updateStage(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStage(@PathVariable Long id) {
        stageService.deleteStage(id);
        return ResponseEntity.noContent().build();
    }
}