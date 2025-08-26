package com.bemyguest.backend.reservation.dto;

import com.bemyguest.backend.reservation.entity.Reservation;
import com.bemyguest.backend.reservation.entity.ReservationStatus;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import java.time.LocalDate;

@Getter
public class ReservationResponseDto {
	
	@Schema(description = "예약 ID", example = "1")
    private final long reservationId;
	@Schema(description = "게스트하우스 이름", example = "서울 한옥 게스트하우스")
    private final String guesthouseName; // 사용자 편의를 위해 숙소 이름 포함
	@Schema(description = "체크인 날짜", example = "2025-08-25")
    private final LocalDate checkinDate;
	@Schema(description = "체크아웃 날짜", example = "2025-08-27")
    private final LocalDate checkoutDate;
	@Schema(description = "예약 상태", example = "RESERVED")
    private final ReservationStatus status;
	@Schema(description = "게스트하우스 ID", example = "1")
    private final long guesthouseId;
	@Schema(description = "리뷰 작성 여부", example = "1")
    private final boolean reviewWritten; // 🌟 리뷰 작성 여부 필드 추가

    public ReservationResponseDto(Reservation reservation, boolean reviewWritten) {
        this.reservationId = reservation.getId();
        this.guesthouseId = reservation.getGuesthouse().getId();
        this.guesthouseName = reservation.getGuesthouse().getName(); // Guesthouse Entity에 getName()이 있다고 가정
        this.checkinDate = reservation.getCheckinDate();
        this.checkoutDate = reservation.getCheckoutDate();
        this.status = reservation.getStatus();
        this.reviewWritten = reviewWritten;
    }
}