package com.bemyguest.backend.wish.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor 		// 모든 멤버 변수를 파라미터로 받는 생성자를 자동으로 만들어줌
public class WishResponse {
	private Long guesthouseId;
	private LocalDateTime createdAt;
}
