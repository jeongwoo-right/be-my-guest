package com.bemyguest.backend.search.controller;

import com.bemyguest.backend.docs.SearchApiDocs;
import com.bemyguest.backend.search.dto.GuesthouseSummary;
import com.bemyguest.backend.search.dto.SearchRequest;
import com.bemyguest.backend.search.service.SearchService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guesthouses")
public class SearchController implements SearchApiDocs {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    // 기본 검색: 예약 겹침 제외, 정렬/페이징 지원
    @PostMapping
    public ResponseEntity<Page<GuesthouseSummary>> search(@Valid @RequestBody SearchRequest request) {
        Page<GuesthouseSummary> result = searchService.searchAvailable(request);
        return ResponseEntity.ok(result);
    }
}
