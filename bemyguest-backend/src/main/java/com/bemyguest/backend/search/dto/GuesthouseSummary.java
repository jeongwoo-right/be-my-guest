package com.bemyguest.backend.search.dto;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;

public class GuesthouseSummary {
	@Schema(description = "게스트하우스 ID", example = "1")
    private Long id;
	@Schema(description = "게스트하우스 이름", example = "서울 한옥 게스트하우스")
    private String name;
	@Schema(description = "게스트하우스 주소", example = "서울 종로구 1-1")
    private String address;
	@Schema(description = "지역", example = "서울")
    private String region;     // 클라이언트 편의를 위해 문자열로 반환
	@Schema(description = "수용 인원", example = "10")
    private int capacity;
	@Schema(description = "가격", example = "55000")
    private BigDecimal price;
	@Schema(description = "설명", example = "전통 한옥 체험 숙소")
    private String description;
	@Schema(description = "평균 평점", example = "0.0")
    private BigDecimal ratingAvg;
	@Schema(description = "평점 수", example = "0")
    private Integer ratingCount;

    public GuesthouseSummary(Long id, String name, String address, String region,
    		int capacity, BigDecimal price, String description,
    		BigDecimal ratingAvg, Integer ratingCount) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.region = region;
        this.capacity = capacity;
        this.price = price;
        this.description = description;
        this.ratingAvg = ratingAvg;
        this.ratingCount = ratingCount;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public String getRegion() { return region; }
    public int getCapacity() { return capacity; }
    public BigDecimal getPrice() { return price; }
    public String getDescription() { return description; }
    public BigDecimal getRatingAvg() { return ratingAvg; }
    public Integer getRatingCount() { return ratingCount; }
}
