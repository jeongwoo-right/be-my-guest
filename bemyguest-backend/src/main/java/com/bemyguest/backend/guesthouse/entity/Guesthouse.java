package com.bemyguest.backend.guesthouse.entity;

import jakarta.persistence.*;
import lombok.*;

import jakarta.persistence.Convert;

@Entity
@Table(name = "guesthouses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Guesthouse {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String address;
    
    

    @Convert(converter = RegionConverter.class)
    @Column(name = "region", nullable = false)
    private Region region;

    // DB column is capacity
    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    private java.math.BigDecimal price;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToOne(mappedBy = "guesthouse", fetch = FetchType.LAZY, optional = true)
    private Facilities facilities;
}