package com.bemyguest.backend.review.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class ReviewRequestDto {
	@Schema(description = "평점", example = "4")
    private int rating;
	@Schema(description = "후기 내용", example = "뷰가 정말 아름다웠습니다!")
    private String content;
} 