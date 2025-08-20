package com.bemyguest.backend.review.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bemyguest.backend.review.dto.ReviewRequestDto;
import com.bemyguest.backend.review.dto.ReviewResponseDto;
import com.bemyguest.backend.review.service.ReviewService;

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
    @PostMapping("/{reservation_id}")
    public ResponseEntity<ReviewResponseDto> createReview(
            @PathVariable("reservation_id") long reservationId,
            @RequestBody ReviewRequestDto requestDto) { // @AuthenticationPrincipal 제거

        // DTO에 포함된 user_id를 Service로 전달
        ReviewResponseDto responseDto = reviewService.createReview(reservationId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    /**
     * 리뷰 수정 API
     * [변경] Request Body에서 user_id를 함께 받음
     */
    @PutMapping("/{review_id}")
    public ResponseEntity<String> updateReview(
            @PathVariable("review_id") long reviewId,
            @RequestBody ReviewRequestDto requestDto) { // @AuthenticationPrincipal 제거

        // DTO에 포함된 user_id를 Service로 전달
        reviewService.updateReview(reviewId, requestDto);
        return ResponseEntity.ok("리뷰가 성공적으로 수정되었습니다.");
    }

    /**
     * 리뷰 삭제 API
     * [변경] Query Parameter로 user_id를 받음
     */
    @DeleteMapping("/{review_id}")
    public ResponseEntity<String> deleteReview(
            @PathVariable("review_id") long reviewId,
            @RequestParam("user_id") long userId) { // @RequestParam으로 userId 받기

        reviewService.deleteReview(reviewId, userId);
        return ResponseEntity.ok("리뷰가 성공적으로 삭제되었습니다.");
    }
    
    /**
     * 숙소별 리뷰 목록 조회 API (변경 없음)
     */
    @GetMapping("/{guesthouse_id}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByGuesthouse(
            @PathVariable("guesthouse_id") long guesthouseId) {

        List<ReviewResponseDto> reviews = reviewService.getReviewsByGuesthouse(guesthouseId);
        return ResponseEntity.ok(reviews);
    }
}