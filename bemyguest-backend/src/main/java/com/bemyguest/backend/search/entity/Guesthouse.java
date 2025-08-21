package com.bemyguest.backend.search.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "guesthouses")
public class Guesthouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 255)
    private String address;

    @Enumerated(EnumType.STRING) // DB ENUM ↔ Java enum 매핑
    @Column(nullable = false, length = 20)
    private Region region;

    @Column(nullable = false)
    private int capacity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Lob
    private String description;
    
    // ⭐ 평점 컬럼 추가 (리뷰팀이 집계해서 채워줄 값)
    @Column(name = "rating_avg", precision = 3, scale = 2) // 예: 4.37
    private BigDecimal ratingAvg;
    
    @Column(name = "rating_count")
    private Integer ratingCount;

    protected Guesthouse() {} // JPA 기본 생성자

    public Guesthouse(String name, String address, Region region, int capacity, BigDecimal price, String description) {
        this.name = name;
        this.address = address;
        this.region = region;
        this.capacity = capacity;
        this.price = price;
        this.description = description;
    }

    // Getter
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public Region getRegion() { return region; }
    public int getCapacity() { return capacity; }
    public BigDecimal getPrice() { return price; }
    public String getDescription() { return description; }
    public BigDecimal getRatingAvg() { return ratingAvg; }
    public Integer getRatingCount() { return ratingCount; }
}
