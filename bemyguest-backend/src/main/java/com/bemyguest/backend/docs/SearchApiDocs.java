package com.bemyguest.backend.docs;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import com.bemyguest.backend.search.dto.GuesthouseSummary;
import com.bemyguest.backend.search.dto.SearchRequest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "2. 검색 API", description = "게스트하우스를 검색하는 API")
public interface SearchApiDocs {
	
	@Operation(summary = "게스트하우스 검색", description = "검색 조건에 맞는 게스트하우스의 목록을 조회합니다.", security = {})
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "게스트하우스 검색 (목록 조회) 성공"),
    })
	ResponseEntity<Page<GuesthouseSummary>> search(@Valid @RequestBody SearchRequest request);

}
