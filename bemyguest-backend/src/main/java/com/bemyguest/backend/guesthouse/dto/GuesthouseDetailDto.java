package com.bemyguest.backend.guesthouse.dto;

import com.bemyguest.backend.guesthouse.entity.Region;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GuesthouseDetailDto {
	@Schema(description = "게스트하우스 ID", example = "1")
    private Long id;
	@Schema(description = "게스트하우스 이름", example = "서울 한옥 게스트하우스")
    private String name;
	@Schema(description = "게스트하우스 주소", example = "서울 종로구 1-1")
    private String address;
	@Schema(description = "지역", example = "서울")
    private String region;          // String for now
	@Schema(description = "수용 인원", example = "10")
    private Integer capacity;       // matches DB column name
	@Schema(description = "가격", example = "55000")
    private BigDecimal price;
	@Schema(description = "설명", example = "전통 한옥 체험 숙소")
    private String description;

	@Schema(description = "[부대시설] 와이파이", example = "1")
    private Boolean wifi;
	@Schema(description = "[부대시설] 주차 공간", example = "1")
    private Boolean parking;
	@Schema(description = "[부대시설] 조식", example = "1")
    private Boolean breakfast;
	@Schema(description = "[부대시설] 냉방", example = "1")
    private Boolean airConditioner;
	@Schema(description = "[부대시설] TV", example = "1")
    private Boolean tv;
	@Schema(description = "[부대시설] 세탁", example = "1")
    private Boolean laundry;
	@Schema(description = "[부대시설] 부엌", example = "1")
    private Boolean kitchen;
	@Schema(description = "[부대시설] 반려동물 동반", example = "0")
    private Boolean petAllowed;
}
