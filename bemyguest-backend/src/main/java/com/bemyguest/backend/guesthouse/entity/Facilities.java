package com.bemyguest.backend.guesthouse.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "facilities")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Facilities {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // MySQL INT UNSIGNED is fine with Long or Integer here

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guesthouse_id", nullable = false, unique = true)
    private Guesthouse guesthouse;

    private Boolean wifi;
    private Boolean parking;
    private Boolean breakfast;

    @Column(name = "air_conditioner")
    private Boolean airConditioner;

    private Boolean tv;
    private Boolean laundry;
    private Boolean kitchen;

    @Column(name = "pet_allowed")
    private Boolean petAllowed;
}
