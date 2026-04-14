package com.conpedales.controller;

import com.conpedales.dto.CreatePhotoDTO;
import com.conpedales.dto.PhotoDTO;
import com.conpedales.dto.UpdatePhotoDTO;
import com.conpedales.dto.UploadUrlResponse;
import com.conpedales.service.PhotoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/photos")
@RequiredArgsConstructor
public class AdminPhotoController {

    private final PhotoService photoService;

    @PostMapping("/upload-url")
    public ResponseEntity<UploadUrlResponse> generateUploadUrl(
            @RequestParam(required = false, defaultValue = "image/jpeg") String contentType) {
        return ResponseEntity.ok(photoService.generateUploadUrl(contentType));
    }

    @PostMapping
    public ResponseEntity<PhotoDTO> createPhoto(@Valid @RequestBody CreatePhotoDTO dto) {
        return ResponseEntity.ok(photoService.createPhoto(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PhotoDTO> updatePhoto(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePhotoDTO dto) {
        return ResponseEntity.ok(photoService.updatePhoto(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePhoto(@PathVariable Long id) {
        photoService.deletePhoto(id);
        return ResponseEntity.noContent().build();
    }
}