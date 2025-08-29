package com.bemyguest.backend.review.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bemyguest.backend.guesthouse.entity.Guesthouse;
import com.bemyguest.backend.reservation.entity.Reservation;
import com.bemyguest.backend.reservation.entity.ReservationStatus;
import com.bemyguest.backend.reservation.repository.ReservationRepository;
import com.bemyguest.backend.review.dto.ReviewRequestDto;
import com.bemyguest.backend.review.dto.ReviewResponseDto;
import com.bemyguest.backend.review.entity.Review;
import com.bemyguest.backend.review.repository.ReviewRepository;
import com.bemyguest.backend.user.entity.User;
import com.bemyguest.backend.user.repository.UserRepository;
import com.bemyguest.backend.user.security.CustomUserDetails;

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
    public ReviewResponseDto createReview(CustomUserDetails userDetails, long reservationId, ReviewRequestDto requestDto) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("해당 예약을 찾을 수 없습니다."));
        
        if (reservation.getStatus() != ReservationStatus.COMPLETED) {
            throw new IllegalStateException("예약이 완료된 상태에서만 리뷰를 작성할 수 있습니다.");
        }
        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new SecurityException("리뷰를 작성할 권한이 없습니다.");
        }
        if (reviewRepository.existsByGuesthouseIdAndUserId(reservation.getGuesthouse().getId(), reservation.getUser().getId())) {
            throw new IllegalStateException("이미 작성된 리뷰가 존재합니다.");
        }
        
        // ★ 추가: Guesthouse 평점 갱신
        Guesthouse guesthouse = reservation.getGuesthouse();
        guesthouse.addReview(requestDto.getRating());

        Review review = new Review(reservation, user, guesthouse, requestDto.getRating(), requestDto.getContent());
        reviewRepository.save(review);

        return new ReviewResponseDto(review);
    }

    // 2. 리뷰 수정
    @Transactional
    public void updateReview(CustomUserDetails userDetails, long reviewId, ReviewRequestDto requestDto) {
    	User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    	Review review = findReviewAndCheckAuthority(reviewId, user.getId());

        // ★ 추가: Guesthouse 평점 갱신
        int oldRating = review.getRating();
        Guesthouse guesthouse = review.getGuesthouse();
        guesthouse.updateReview(oldRating, requestDto.getRating());
        
        review.update(requestDto.getRating(), requestDto.getContent());
    }

    // 3. 리뷰 삭제
    @Transactional
    public void deleteReview(long reviewId, CustomUserDetails userDetails) {
    	User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Review review = findReviewAndCheckAuthority(reviewId, user.getId());
        
        // ★ 추가: Guesthouse 평점 갱신
        int deletedRating = review.getRating();
        Guesthouse guesthouse = review.getGuesthouse();
        guesthouse.deleteReview(deletedRating);

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

    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getReviewsByUser(CustomUserDetails userDetails) {
    	User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        return reviewRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId())
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