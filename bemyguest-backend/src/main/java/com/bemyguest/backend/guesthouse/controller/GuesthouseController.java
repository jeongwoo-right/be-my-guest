package com.bemyguest.backend.guesthouse.controller;

import com.bemyguest.backend.guesthouse.dto.GuesthouseDetailDto;
import com.bemyguest.backend.guesthouse.service.GuesthouseService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guesthouses")
@RequiredArgsConstructor
public class GuesthouseController {

    private final GuesthouseService guesthouseService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getGuesthouseDetail(@PathVariable("id") Long id) {
        try {
            GuesthouseDetailDto dto = guesthouseService.getDetail(id);
            return ResponseEntity.ok(dto);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
