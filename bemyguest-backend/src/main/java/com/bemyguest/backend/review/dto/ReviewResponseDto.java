package com.bemyguest.backend.review.dto;

import lombok.Getter;
import java.time.LocalDateTime;

import com.bemyguest.backend.review.entity.Review;

@Getter
public class ReviewResponseDto {
    private long reviewId;
    private String authorNickname; // 작성자 ID 대신 닉네임 등을 보내주는 것이 일반적
    private int rating;
    private String content;
    private LocalDateTime createdAt;

    public ReviewResponseDto(Review review) {
        this.reviewId = review.getId();
        this.authorNickname = review.getUser().getNickname(); // User 객체에 getNickname()이 있다고 가정
        this.rating = review.getRating();
        this.content = review.getContent();
        this.createdAt = review.getCreatedAt();
    }
}