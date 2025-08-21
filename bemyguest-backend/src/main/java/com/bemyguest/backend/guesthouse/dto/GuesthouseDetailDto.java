package com.bemyguest.backend.guesthouse.dto;

import com.bemyguest.backend.guesthouse.entity.Region;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GuesthouseDetailDto {
    private Long id;
    private String name;
    private String address;
    private String region;          // String for now
    private Integer capacity;       // matches DB column name
    private BigDecimal price;
    private String description;

    private Boolean wifi;
    private Boolean parking;
    private Boolean breakfast;
    private Boolean airConditioner;
    private Boolean tv;
    private Boolean laundry;
    private Boolean kitchen;
    private Boolean petAllowed;
}
