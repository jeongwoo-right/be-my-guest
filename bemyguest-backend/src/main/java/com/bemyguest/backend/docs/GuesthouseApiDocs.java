package com.bemyguest.backend.docs;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "3. 게스트하우스 API", description = "게스트하우스 관련 정보를 다루는 API")
public interface GuesthouseApiDocs {
	
	@Operation(summary = "게스트하우스 상세 정보 조회", description = "특정 게스트하우스의 정보를 조회합니다.", security = {})
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "게스트하우스 상세 정보 조회 성공"),
    })
	@Parameters({
        @Parameter(description = "상세 정보를 조회할 게스트하우스 ID", name = "id")
	})
	ResponseEntity<?> getGuesthouseDetail(@PathVariable("id") Long id);
	
	
}
