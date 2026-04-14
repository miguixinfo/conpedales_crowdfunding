package com.conpedales.controller;

import com.conpedales.dto.PhotoDTO;
import com.conpedales.service.PhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    @GetMapping
    public ResponseEntity<List<PhotoDTO>> getAllPhotos() {
        return ResponseEntity.ok(photoService.getAllPhotos());
    }

    @GetMapping("/stage/{stageId}")
    public ResponseEntity<List<PhotoDTO>> getPhotosByStageId(@PathVariable Long stageId) {
        return ResponseEntity.ok(photoService.getPhotosByStageId(stageId));
    }

    @GetMapping("/highlight")
    public ResponseEntity<List<PhotoDTO>> getHighlightPhotos() {
        return ResponseEntity.ok(photoService.getHighlightPhotos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhotoDTO> getPhotoById(@PathVariable Long id) {
        return ResponseEntity.ok(photoService.getPhotoById(id));
    }
}