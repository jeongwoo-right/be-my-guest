package com.bemyguest.backend.reservation.controller;

import com.bemyguest.backend.reservation.dto.ReservationRequestDto;
import com.bemyguest.backend.reservation.dto.ReservationResponseDto;
import com.bemyguest.backend.reservation.service.ReservationService;
import com.bemyguest.backend.user.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    // 1. 예약 생성 API
    @PostMapping
    public ResponseEntity<ReservationResponseDto> createReservation(@AuthenticationPrincipal CustomUserDetails userDetails,
    		@RequestBody ReservationRequestDto requestDto) {
        ReservationResponseDto responseDto = reservationService.createReservation(userDetails, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    // 2. 예약 취소 API
    @PatchMapping("/{reservation_id}/cancel")
    public ResponseEntity<String> cancelReservation(@AuthenticationPrincipal CustomUserDetails userDetails,
    		@PathVariable("reservation_id") long reservationId) {
        reservationService.cancelReservation(userDetails, reservationId);
        return ResponseEntity.ok("예약이 성공적으로 취소되었습니다.");
    }

    // 3. 예약 완료(체크아웃) API
    @PatchMapping("/{reservation_id}/complete")
    public ResponseEntity<String> completeReservation(@PathVariable("reservation_id") long reservationId) {
        reservationService.completeReservation(reservationId);
        return ResponseEntity.ok("예약이 성공적으로 완료 처리되었습니다.");
    }
    
    // 4. 예약 목록 조회 API
    @GetMapping("/history")
    public ResponseEntity<List<ReservationResponseDto>> getReservationsForUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
                
        List<ReservationResponseDto> reservations = reservationService.getReservationsByUser(userDetails);
        return ResponseEntity.ok(reservations);
    }
}