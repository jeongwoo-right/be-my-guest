package com.bemyguest.backend.search.controller;

import com.bemyguest.backend.search.dto.GuesthouseSummary;
import com.bemyguest.backend.search.dto.SearchRequest;
import com.bemyguest.backend.search.service.SearchService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guesthouses")  // 명세서 유지
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    // ✅ 기본 검색 엔드포인트를 '예약 겹침 제외' 로직으로 매핑
    // POST /api/guesthouses
    @PostMapping
    public ResponseEntity<List<GuesthouseSummary>> search(@Valid @RequestBody SearchRequest request) {
        List<GuesthouseSummary> result = searchService.searchAvailable(request);
        return ResponseEntity.ok(result);
    }

}
