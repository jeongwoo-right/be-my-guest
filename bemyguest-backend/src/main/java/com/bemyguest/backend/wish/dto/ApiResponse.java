package com.bemyguest.backend.wish.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiResponse {
	@Schema(description = "응답 메시지")
	private String message;
}
