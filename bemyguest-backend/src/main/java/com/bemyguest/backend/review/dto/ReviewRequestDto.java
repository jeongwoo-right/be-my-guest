package com.bemyguest.backend.review.dto;

import lombok.Getter;

@Getter
public class ReviewRequestDto {
	private long userId;
    private int rating;
    private String content;
} 