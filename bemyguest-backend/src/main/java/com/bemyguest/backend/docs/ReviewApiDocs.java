package com.bemyguest.backend.docs;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.bemyguest.backend.review.dto.ReviewRequestDto;
import com.bemyguest.backend.review.dto.ReviewResponseDto;
import com.bemyguest.backend.user.security.CustomUserDetails;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "6. 후기 API", description = "후기 CRUD API")
public interface ReviewApiDocs {
	
	@Operation(summary = "후기 작성", description = "로그인한 회원이 특정 예약(완료 상태)에 대한 후기를 작성합니다.")
	@ApiResponses({
        @ApiResponse(responseCode = "201", description = "후기 작성 성공"),
    })
	@Parameters({
        @Parameter(description = "후기를 작성할 예약 ID", name = "reservation_id")
	})
	ResponseEntity<ReviewResponseDto> createReview(
    		@AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("reservation_id") long reservationId,
            @RequestBody ReviewRequestDto requestDto);
	
	@Operation(summary = "후기 수정", description = "로그인한 회원이 특정 후기의 내용을 수정합니다.")
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "후기 수정 성공"),
    })
	@Parameters({
        @Parameter(description = "수정할 후기 ID", name = "review_id")
	})
	ResponseEntity<String> updateReview(
    		@AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("review_id") long reviewId,
            @RequestBody ReviewRequestDto requestDto);
	
	@Operation(summary = "후기 삭제", description = "로그인한 회원이 특정 후기를 삭제합니다.")
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "후기 삭제 성공"),
    })
	@Parameters({
        @Parameter(description = "삭제할 후기 ID", name = "review_id")
	})
	ResponseEntity<String> deleteReview(
    		@AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("review_id") long reviewId);
	
	@Operation(summary = "게스트하우스에 대한 후기 목록 조회", description = "특정 게스트하우스에 대한 모든 후기를 조회합니다.", security = {})
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "후기 목록 조회 성공"),
    })
	@Parameters({
        @Parameter(description = "후기 목록을 조회할 게스트하우스 ID", name = "guesthouse_id")
	})
	ResponseEntity<List<ReviewResponseDto>> getReviewsByGuesthouse(
            @PathVariable("guesthouse_id") long guesthouseId);
	
	@Operation(summary = "내 후기 목록 조회", description = "로그인한 회원이 자신의 모든 후기를 조회합니다.")
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "후기 목록 조회 성공"),
    })
	ResponseEntity<List<ReviewResponseDto>> getReviewsByUser(
    		@AuthenticationPrincipal CustomUserDetails userDetails);

}
