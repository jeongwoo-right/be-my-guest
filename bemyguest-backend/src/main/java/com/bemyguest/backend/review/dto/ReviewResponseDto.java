package com.bemyguest.backend.review.dto;

import lombok.Getter;
import java.time.LocalDateTime;

import com.bemyguest.backend.review.entity.Review;

import io.swagger.v3.oas.annotations.media.Schema;
 
@Getter
public class ReviewResponseDto {
	@Schema(description = "후기 ID", example = "1")
    private long reviewId;
	@Schema(description = "후기 작성자 닉네임", example = "수빈")
    private String authorNickname; // 작성자 ID 대신 닉네임 등을 보내주는 것이 일반적
	@Schema(description = "게스트하우스 이름", example = "서울 한옥 게스트하우스")
    private String guesthouseName;
	@Schema(description = "게스트하우스 ID", example = "1")
    private long guesthouseId;
	@Schema(description = "평점", example = "4")
    private int rating;
	@Schema(description = "후기 내용", example = "뷰가 정말 아름다웠습니다!")
    private String content;
	@Schema(description = "후기 작성 날짜", example = "2025-08-22 15:15:03")
    private LocalDateTime createdAt;
	@Schema(description = "후기 수정 날짜", example = "2025-08-23 15:15:03")
    private final LocalDateTime updatedAt;

    public ReviewResponseDto(Review review) {
        this.reviewId = review.getId();
        this.authorNickname = review.getUser().getNickname(); // User 객체에 getNickname()이 있다고 가정
        this.guesthouseName = review.getGuesthouse().getName();
        this.guesthouseId = review.getGuesthouse().getId();
        this.rating = review.getRating();
        this.content = review.getContent();
        this.createdAt = review.getCreatedAt();
        this.updatedAt = review.getUpdatedAt();
    }
}