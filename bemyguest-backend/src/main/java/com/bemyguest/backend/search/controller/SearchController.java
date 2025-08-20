package com.bemyguest.backend.search.controller;

import com.bemyguest.backend.search.dto.SearchRequest;
import com.bemyguest.backend.search.entity.Guesthouse;
import com.bemyguest.backend.search.service.SearchService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    // 다음 단계에서 "예약 겹침 제외" 로직 붙이기 전, 기본 검색 엔드포인트
    @PostMapping("/basic")
    public ResponseEntity<List<Guesthouse>> searchBasic(@Valid @RequestBody SearchRequest request) {
        List<Guesthouse> result = searchService.searchBasic(request);
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/available")
    public ResponseEntity<List<Guesthouse>> searchAvailable(@Valid @RequestBody SearchRequest request) {
        List<Guesthouse> result = searchService.searchAvailable(request);
        return ResponseEntity.ok(result);
    }

}
