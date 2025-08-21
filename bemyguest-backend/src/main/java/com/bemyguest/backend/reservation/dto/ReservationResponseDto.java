package com.bemyguest.backend.reservation.dto;

import com.bemyguest.backend.reservation.entity.Reservation;
import com.bemyguest.backend.reservation.entity.ReservationStatus;
import lombok.Getter;
import java.time.LocalDate;

@Getter
public class ReservationResponseDto {
    private final long reservationId;
    private final String guesthouseName; // 사용자 편의를 위해 숙소 이름 포함
    private final LocalDate checkinDate;
    private final LocalDate checkoutDate;
    private final ReservationStatus status;

    public ReservationResponseDto(Reservation reservation) {
        this.reservationId = reservation.getId();
        this.guesthouseName = reservation.getGuesthouse().getName(); // Guesthouse Entity에 getName()이 있다고 가정
        this.checkinDate = reservation.getCheckinDate();
        this.checkoutDate = reservation.getCheckoutDate();
        this.status = reservation.getStatus();
    }
}