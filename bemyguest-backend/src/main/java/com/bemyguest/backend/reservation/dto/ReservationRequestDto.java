package com.bemyguest.backend.reservation.dto;

import lombok.Getter;
import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;

@Getter
public class ReservationRequestDto {
	@Schema(description = "게스트하우스 ID", example = "1")
    private long guesthouseId;
	@Schema(description = "체크인 날짜", example = "2025-08-25")
    private LocalDate checkinDate;
	@Schema(description = "체크아웃 날짜", example = "2025-08-27")
    private LocalDate checkoutDate;
}