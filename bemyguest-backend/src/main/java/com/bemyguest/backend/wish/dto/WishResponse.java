package com.bemyguest.backend.wish.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.bemyguest.backend.guesthouse.entity.Region;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor 		// 모든 멤버 변수를 파라미터로 받는 생성자를 자동으로 만들어줌
public class WishResponse {
	@Schema(description = "게스트하우스 ID", example = "1")
    private Long id;
	@Schema(description = "게스트하우스 이름", example = "서울 한옥 게스트하우스")
    private String name;
	@Schema(description = "게스트하우스 주소", example = "서울 종로구 1-1")
    private String address;
	@Schema(description = "지역", example = "서울")
    private Region region;
	@Schema(description = "수용 인원", example = "10")
    private Integer capacity;
	@Schema(description = "가격", example = "55000")
    private BigDecimal price;
	@Schema(description = "설명", example = "전통 한옥 체험 숙소")
    private String description;
	@Schema(description = "평균 평점", example = "0.0")
    private BigDecimal ratingAvg;
	@Schema(description = "평점 수", example = "0")
    private Integer ratingCount;
	@Schema(description = "찜 생성 날짜", example = "2025-08-22 15:15:03")
    private LocalDateTime createdAt;
}
