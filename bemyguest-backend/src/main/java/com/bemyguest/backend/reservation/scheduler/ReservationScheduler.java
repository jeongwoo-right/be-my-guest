package com.bemyguest.backend.reservation.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.bemyguest.backend.reservation.service.ReservationService;

import lombok.RequiredArgsConstructor;

@Component // Spring이 이 클래스를 Bean으로 관리하도록 설정
@RequiredArgsConstructor
public class ReservationScheduler {

    private final ReservationService reservationService;

    // cron 표현식을 사용하여 스케줄을 정의
    // 매일 새벽 2시 0분 0초에 실행
    @Scheduled(cron = "0 0 2 * * ?") 
    public void runAutoCompleteReservations() {
        reservationService.autoCompleteReservations();
    }
}