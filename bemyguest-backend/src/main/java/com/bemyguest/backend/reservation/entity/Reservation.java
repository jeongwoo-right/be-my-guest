package com.bemyguest.backend.reservation.entity;

import com.bemyguest.backend.guesthouse.entity.Guesthouse;
import com.bemyguest.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "reservations")
@EntityListeners(AuditingEntityListener.class) // Auditing 활성화
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guesthouse_id", nullable = false)
    private Guesthouse guesthouse;

    @Column(nullable = false)
    private LocalDate checkinDate;

    @Column(nullable = false)
    private LocalDate checkoutDate;

    @Enumerated(EnumType.STRING) // Enum 이름을 DB에 문자열로 저장
    @Column(nullable = false)
    private ReservationStatus status;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // 생성자: 예약 생성 시 초기 상태는 항상 'RESERVED'
    public Reservation(User user, Guesthouse guesthouse, LocalDate checkinDate, LocalDate checkoutDate) {
        this.user = user;
        this.guesthouse = guesthouse;
        this.checkinDate = checkinDate;
        this.checkoutDate = checkoutDate;
        this.status = ReservationStatus.RESERVED; // 초기 상태 고정
    }

    //== 비즈니스 로직 ==//
    // 예약 취소
    public void cancel() {
        if (this.status == ReservationStatus.COMPLETED) {
            throw new IllegalStateException("이미 완료된 예약은 취소할 수 없습니다.");
        }
        this.status = ReservationStatus.CANCELLED;
    }
    
    // 예약 완료
    public void complete() {
        if (this.status == ReservationStatus.CANCELLED) {
            throw new IllegalStateException("이미 취소된 예약은 완료 처리할 수 없습니다.");
        }
        this.status = ReservationStatus.COMPLETED;
    }
}