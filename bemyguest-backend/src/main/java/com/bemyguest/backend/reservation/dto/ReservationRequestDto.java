package com.bemyguest.backend.reservation.dto;

import lombok.Getter;
import java.time.LocalDate;

@Getter
public class ReservationRequestDto {
    private long guesthouseId;
    private LocalDate checkinDate;
    private LocalDate checkoutDate;
}