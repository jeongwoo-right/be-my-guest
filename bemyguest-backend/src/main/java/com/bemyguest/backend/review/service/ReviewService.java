package com.bemyguest.backend.review.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bemyguest.backend.review.dto.ReviewRequestDto;
import com.bemyguest.backend.review.dto.ReviewResponseDto;
import com.bemyguest.backend.review.entity.Review;
import com.bemyguest.backend.review.repository.ReviewRepository;
import com.bemyguest.backend.user.entity.User;
import com.bemyguest.backend.user.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;
 
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository; // UserRepository 주입

    // 1. 리뷰 작성
    @Transactional
    public ReviewResponseDto createReview(long reservationId, ReviewRequestDto requestDto) {
        // [변경] DTO에서 userId를 가져와 User 객체를 조회
        User user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("해당 예약을 찾을 수 없습니다."));
        
        // ... (이하 로직은 기존과 유사)
        if (reservation.getStatus() != ReservationStatus.COMPLETED) {
            throw new IllegalStateException("예약이 완료된 상태에서만 리뷰를 작성할 수 있습니다.");
        }
        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new SecurityException("리뷰를 작성할 권한이 없습니다.");
        }
        if (reviewRepository.existsByReservationId(reservationId)) {
            throw new IllegalStateException("이미 작성된 리뷰가 존재합니다.");
        }

        Review review = new Review(reservation, user, reservation.getGuesthouse(), requestDto.getRating(), requestDto.getContent());
        reviewRepository.save(review);

        return new ReviewResponseDto(review);
    }

    // 2. 리뷰 수정
    @Transactional
    public void updateReview(long reviewId, ReviewRequestDto requestDto) {
        // [변경] DTO에서 userId를 가져와 권한 확인
        Review review = findReviewAndCheckAuthority(reviewId, requestDto.getUserId());
        review.update(requestDto.getRating(), requestDto.getContent());
    }

    // 3. 리뷰 삭제
    @Transactional
    public void deleteReview(long reviewId, long userId) {
        // [변경] 파라미터로 받은 userId로 권한 확인
        Review review = findReviewAndCheckAuthority(reviewId, userId);
        reviewRepository.delete(review);
    }

    // 4. 숙소별 리뷰 목록 조회 (변경 없음)
    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getReviewsByGuesthouse(long guesthouseId) {
        return reviewRepository.findByGuesthouseIdOrderByIdDesc(guesthouseId)
                .stream()
                .map(ReviewResponseDto::new)
                .collect(Collectors.toList());
    }

    // (공통 메서드) 파라미터 변경
    private Review findReviewAndCheckAuthority(long reviewId, long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("해당 리뷰를 찾을 수 없습니다."));

        if (!review.getUser().getId().equals(userId)) {
            throw new SecurityException("리뷰를 수정/삭제할 권한이 없습니다.");
        }
        return review;
    }
}