package com.bemyguest.backend.docs;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.bemyguest.backend.reservation.dto.ReservationRequestDto;
import com.bemyguest.backend.reservation.dto.ReservationResponseDto;
import com.bemyguest.backend.user.security.CustomUserDetails;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "5. 예약 API", description = "예약을 생성하거나 상태를 변경하고, 내역을 조회하는 API")
public interface ReservationApiDocs {
	
	@Operation(summary = "예약 생성", description = "로그인한 회원이 특정 게스트하우스를 예약합니다.")
	@ApiResponses({
        @ApiResponse(responseCode = "201", description = "예약 성공"),
    })
	ResponseEntity<ReservationResponseDto> createReservation(@AuthenticationPrincipal CustomUserDetails userDetails,
    		@RequestBody ReservationRequestDto requestDto);
	
	@Operation(summary = "예약 취소", description = "로그인한 회원이 특정 게스트하우스에 대한 예약을 취소합니다.")
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "예약 취소 성공"),
    })
	@Parameters({
        @Parameter(description = "취소할 예약 ID", name = "reservation_id")
	})
	ResponseEntity<String> cancelReservation(@AuthenticationPrincipal CustomUserDetails userDetails,
    		@PathVariable("reservation_id") long reservationId);
	
	@Operation(summary = "예약 상태 변경 (완료)", description = "예약이 완료 상태로 변경됩니다.")
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "예약 상태 변경 성공"),
    })
	@Parameters({
        @Parameter(description = "상태를 변경할 예약 ID", name = "reservation_id")
	})
	ResponseEntity<String> completeReservation(@PathVariable("reservation_id") long reservationId);
	
	@Operation(summary = "예약 내역 조회", description = "로그인한 회원의 예약 내역을 조회합니다. 모든 상태(예약, 취소 완료)의 예약이 포함됩니다.")
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "예약 내역 조회 성공"),
    })
	ResponseEntity<List<ReservationResponseDto>> getReservationsForUser(@AuthenticationPrincipal CustomUserDetails userDetails);
	
	
}
