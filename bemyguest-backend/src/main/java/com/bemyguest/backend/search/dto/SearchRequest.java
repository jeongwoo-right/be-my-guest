package com.bemyguest.backend.search.dto;

import com.bemyguest.backend.guesthouse.entity.Region;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

public class SearchRequest {

    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    @Min(1)
    private int guests;

    // null 이면 전체 지역 검색
    private Region region;
    
    // ⭐ 페이징/정렬 기본값
    @Min(0)
    private Integer page = 0;
    
    @Min(1)
    private Integer size = 10;
    
    // name | price | rating
    @Pattern(regexp = "name|price|rating")
    private String sort = "price";
    
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
