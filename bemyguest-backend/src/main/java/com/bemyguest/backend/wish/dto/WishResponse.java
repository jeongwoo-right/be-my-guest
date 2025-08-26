package com.bemyguest.backend.wish.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.bemyguest.backend.guesthouse.entity.Region;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor 		// 모든 멤버 변수를 파라미터로 받는 생성자를 자동으로 만들어줌
public class WishResponse {
    private Long id;
    private String name;
    private String address;
    private Region region;
    private Integer capacity;
    private BigDecimal price;
    private String description;
    private BigDecimal ratingAvg;
    private Integer ratingCount;
    private LocalDateTime createdAt;
}