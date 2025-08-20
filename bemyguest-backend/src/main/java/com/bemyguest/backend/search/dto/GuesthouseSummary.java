package com.bemyguest.backend.search.dto;

import java.math.BigDecimal;

public class GuesthouseSummary {
    private Long id;
    private String name;
    private String address;
    private String region;     // 클라이언트 편의를 위해 문자열로 반환
    private int capacity;
    private BigDecimal price;
    private String description;

    public GuesthouseSummary(Long id, String name, String address, String region,
                             int capacity, BigDecimal price, String description) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.region = region;
        this.capacity = capacity;
        this.price = price;
        this.description = description;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public String getRegion() { return region; }
    public int getCapacity() { return capacity; }
    public BigDecimal getPrice() { return price; }
    public String getDescription() { return description; }
}
