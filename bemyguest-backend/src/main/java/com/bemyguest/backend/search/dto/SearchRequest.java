package com.bemyguest.backend.search.dto;

import com.bemyguest.backend.guesthouse.entity.Region;
import com.fasterxml.jackson.annotation.JsonFormat;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

public class SearchRequest {

	@Schema(description = "희망 체크인 날짜", example = "2025-08-25")
    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

	@Schema(description = "희망 체크아웃 날짜", example = "2025-08-27")
    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

	@Schema(description = "묵을 인원", example = "3")
    @Min(1)
    private int guests;

	@Schema(description = "지역", example = "서울")
    // null 이면 전체 지역 검색
    private Region region;
    
	@Schema(description = "[페이징] 선택 페이지 (기본값: 0)", example = "0")
    // ⭐ 페이징/정렬 기본값
    @Min(0)
    private Integer page = 0;
    
	@Schema(description = "[페이징] 한 페이지당 노출되는 게스트하우스 수 (기본값: 10)", example = "10")
    @Min(1)
    private Integer size = 10;
    
	@Schema(description = "[정렬] 검색 결과 정렬 기준", example = "price")
    // name | price | rating
    @Pattern(regexp = "name|price|rating")
    private String sort = "price";
    
	@Schema(description = "[정렬] 검색 결과 정렬 순서", example = "asc")
    // asc | desc
    @Pattern(regexp = "asc|desc")
    private String dir = "asc";

    // 기본 생성자 (JSON 역직렬화용)
    public SearchRequest() {}

    // Getter/Setter (요청 바인딩과 검증을 위해 필요)
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public int getGuests() { return guests; }
    public void setGuests(int guests) { this.guests = guests; }

    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }
    
    public Integer getPage() { return page;}
    public void setPage(Integer page) { this.page = page; }
    
    public Integer getSize() { return size;}
    public void setSize(Integer size) { this.size = size; }
    
    public String getSort() { return sort;}
    public void setSort(String sort) { this.sort = sort; }
    
    public String getDir() { return dir;}
    public void setDir(String dir) { this.dir = dir; }
}
