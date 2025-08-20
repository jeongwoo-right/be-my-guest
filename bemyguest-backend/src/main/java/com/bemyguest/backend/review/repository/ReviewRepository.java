package com.bemyguest.backend.review.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bemyguest.backend.review.entity.Review;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // 숙소 ID를 기준으로 모든 리뷰를 찾고, 최신순(ID 역순)으로 정렬하는 메서드
    List<Review> findByGuesthouseIdOrderByIdDesc(long guesthouseId);
    
    // 예약 ID로 리뷰가 이미 존재하는지 확인하는 메서드 (중복 작성 방지) 
    boolean existsByReservationId(long reservationId);
}