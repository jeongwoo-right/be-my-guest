package com.bemyguest.backend.review.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.bemyguest.backend.review.dto.ReviewRequestDto;
import com.bemyguest.backend.review.dto.ReviewResponseDto;
import com.bemyguest.backend.review.service.ReviewService;
import com.bemyguest.backend.user.security.CustomUserDetails;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/review")
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * 리뷰 작성 API
     * [변경] Request Body에서 user_id를 함께 받음
     */
    @PostMapping("/create/{reservation_id}")
    public ResponseEntity<ReviewResponseDto> createReview(
    		@AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("reservation_id") long reservationId,
            @RequestBody ReviewRequestDto requestDto) { // @AuthenticationPrincipal 제거

        ReviewResponseDto responseDto = reviewService.createReview(userDetails, reservationId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    /**
     * 리뷰 수정 API
     * [변경] Request Body에서 user_id를 함께 받음
     */
    @PutMapping("/edit/{review_id}")
    public ResponseEntity<String> updateReview(
    		@AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("review_id") long reviewId,
            @RequestBody ReviewRequestDto requestDto) { // @AuthenticationPrincipal 제거

        // DTO에 포함된 user_id를 Service로 전달
        reviewService.updateReview(userDetails, reviewId, requestDto);
        return ResponseEntity.ok("리뷰가 성공적으로 수정되었습니다.");
    }

    /**
     * 리뷰 삭제 API
     * [변경] Query Parameter로 user_id를 받음
     */
    @DeleteMapping("/edit/{review_id}")
    public ResponseEntity<String> deleteReview(
    		@AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("review_id") long reviewId) { // @RequestParam으로 userId 받기

        reviewService.deleteReview(reviewId, userDetails);
        return ResponseEntity.ok("리뷰가 성공적으로 삭제되었습니다.");
    }
    
    /**
     * 숙소별 리뷰 목록 조회 API (변경 없음)
     */
    @GetMapping("/search/guesthouse/{guesthouse_id}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByGuesthouse(
            @PathVariable("guesthouse_id") long guesthouseId) {

        List<ReviewResponseDto> reviews = reviewService.getReviewsByGuesthouse(guesthouseId);
        return ResponseEntity.ok(reviews);
    }
    
    /**
     * 유저별 리뷰 목록 조회 API
     */
    @GetMapping("/search/user/me")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByUser(
    		@AuthenticationPrincipal CustomUserDetails userDetails) {
            
        List<ReviewResponseDto> reviews = reviewService.getReviewsByUser(userDetails);
        return ResponseEntity.ok(reviews);
    }
}