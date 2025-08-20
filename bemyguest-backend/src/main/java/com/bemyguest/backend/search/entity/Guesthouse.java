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
}
