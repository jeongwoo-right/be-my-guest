package com.bemyguest.backend.docs;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.bemyguest.backend.user.security.CustomUserDetails;
//import com.bemyguest.backend.wish.dto.ApiResponse;
import com.bemyguest.backend.wish.dto.CreateWishRequest;
import com.bemyguest.backend.wish.dto.WishResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "4. 찜 API", description = "회원이 게스트하우스를 찜하는 기능을 관리하는 API")
public interface WishApiDocs {
	
	@Operation(summary = "찜 목록에 추가", description = "로그인된 회원의 찜 목록에 특정 게스트하우스를 추가합니다.")
	@ApiResponses({
        @ApiResponse(responseCode = "201", description = "찜 추가 성공"),
    })
	ResponseEntity<com.bemyguest.backend.wish.dto.ApiResponse> addWish(@AuthenticationPrincipal CustomUserDetails userDetails,
    		@RequestBody CreateWishRequest request);
	
	@Operation(summary = "찜 목록 조회", description = "로그인된 회원의 찜 목록을 조회합니다.")
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "찜 목록 조회 성공"),
    })
	ResponseEntity<List<WishResponse>> getMyWishes(@AuthenticationPrincipal CustomUserDetails userDetails);
	
	@Operation(summary = "찜 목록에서 삭제", description = "로그인된 회원의 찜 목록에서 특정 게스트하우스를 삭제합니다.")
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "찜 삭제 성공"),
    })
	@Parameters({
        @Parameter(description = "찜에서 삭제할 게스트하우스 ID", name = "guesthouseId")
	})
	ResponseEntity<com.bemyguest.backend.wish.dto.ApiResponse> deleteWish(@AuthenticationPrincipal CustomUserDetails userDetails,
			@PathVariable("guesthouseId") Long guesthouseId);
}
