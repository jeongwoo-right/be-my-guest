package com.bemyguest.backend.reservation.service;

import com.bemyguest.backend.guesthouse.entity.Guesthouse;
import com.bemyguest.backend.guesthouse.repository.GuesthouseRepository;
import com.bemyguest.backend.reservation.dto.ReservationRequestDto;
import com.bemyguest.backend.reservation.dto.ReservationResponseDto;
import com.bemyguest.backend.reservation.entity.Reservation;
import com.bemyguest.backend.reservation.entity.ReservationStatus;
import com.bemyguest.backend.reservation.repository.ReservationRepository;
import com.bemyguest.backend.review.repository.ReviewRepository;
import com.bemyguest.backend.user.entity.User;
import com.bemyguest.backend.user.repository.UserRepository;
import com.bemyguest.backend.user.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final GuesthouseRepository guesthouseRepository;

    // 1. 예약 생성
    @Transactional
    public ReservationResponseDto createReservation(CustomUserDetails userDetails, ReservationRequestDto requestDto) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Guesthouse guesthouse = guesthouseRepository.findById(requestDto.getGuesthouseId())
                .orElseThrow(() -> new IllegalArgumentException("숙소를 찾을 수 없습니다."));

        Reservation reservation = new Reservation(user, guesthouse, requestDto.getCheckinDate(), requestDto.getCheckoutDate());
        reservationRepository.save(reservation);

        return new ReservationResponseDto(reservation, false);
    }

    // 2. 예약 취소
    @Transactional
    public void cancelReservation(CustomUserDetails userDetails, long reservationId) {
    	
    	User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));
        
        if (user != reservation.getUser()) {
        	throw new SecurityException("올바르지 않은 사용자입니다.");
        }
        
        // Entity 내부의 비즈니스 로직 호출
        reservation.cancel();
    }

    // 3. 예약 완료 처리
    @Transactional
    public void completeReservation(long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));
        
        // Entity 내부의 비즈니스 로직 호출
        reservation.complete();
    }
    
    @Transactional(readOnly = true)
    public List<ReservationResponseDto> getReservationsByUser(CustomUserDetails userDetails) {
    	User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        long userId = user.getId();
        List<Reservation> reservations = reservationRepository.findAllByUserIdOrderByCreatedAtDesc(userId);

        return reservations.stream()
                .map(reservation -> {
                    boolean hasReview = reviewRepository.existsByReservationId(reservation.getId());
                    return new ReservationResponseDto(reservation, hasReview);
                })
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void autoCompleteReservations() {
        // 1. 어제 날짜를 기준으로 삼는다 (오늘이 체크아웃 다음 날이므로)
        LocalDate yesterday = LocalDate.now().minusDays(1);
        
        // 2. 어제가 체크아웃 날짜이고, 상태가 'RESERVED'인 모든 예약을 조회
        List<Reservation> targetReservations = reservationRepository
                .findAllByCheckoutDateAndStatus(yesterday, ReservationStatus.RESERVED);

        // 3. 조회된 예약들의 상태를 'COMPLETED'로 변경
        for (Reservation reservation : targetReservations) {
            reservation.complete();
        }
    }
}