package com.bemyguest.backend.search.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK: 예약자 (지금은 간단히 숫자만 보관; 나중에 User 엔티티로 연동 가능)
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // FK: 게스트하우스
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "guesthouse_id")
    private Guesthouse guesthouse;

    @Column(name = "checkin_date", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "checkout_date", nullable = false)
    private LocalDate checkOutDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReservationStatus status; // RESERVED / CANCELLED / COMPLETED

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected Reservation() {}

    public Reservation(Long userId, Guesthouse guesthouse,
                       LocalDate checkInDate, LocalDate checkOutDate,
                       ReservationStatus status,
                       LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.userId = userId;
        this.guesthouse = guesthouse;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // --- Getter ---
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Guesthouse getGuesthouse() { return guesthouse; }
    public LocalDate getCheckInDate() { return checkInDate; }
    public LocalDate getCheckOutDate() { return checkOutDate; }
    public ReservationStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // 상태값 ENUM (한 파일로 끝내기 위해 내부에 정의)
    public enum ReservationStatus {
        RESERVED, CANCELLED, COMPLETED
    }
}
