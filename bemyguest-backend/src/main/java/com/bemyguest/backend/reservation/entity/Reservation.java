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
@Table(
    name = "reservations",
    indexes = {
        // ★ 검색 성능을 위해 추가: 게스트하우스+기간, 상태 인덱스
        @Index(name = "idx_resv_guesthouse_dates", columnList = "guesthouse_id, checkin_date, checkout_date"),
        @Index(name = "idx_resv_status", columnList = "status")
    }
)
@EntityListeners(AuditingEntityListener.class) // Auditing 활성화 (createdAt/updatedAt 자동 세팅)
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    // 친구 코드 유지: User 연관관계 (지연 로딩)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 친구 코드 유지: Guesthouse 연관관계 (지연 로딩)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "guesthouse_id", nullable = false)
    private Guesthouse guesthouse;

    // 필드/컬럼명은 친구 코드 컨벤션에 맞춤 (낙타표기 + _date 컬럼)
    @Column(name = "checkin_date", nullable = false)
    private LocalDate checkinDate;

    @Column(name = "checkout_date", nullable = false)
    private LocalDate checkoutDate;

    // 상태는 문자열로 저장 (RESERVED/CANCELLED/COMPLETED)
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ReservationStatus status;

    // Auditing 자동 관리
    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 생성자: 예약 생성 시 초기 상태는 항상 'RESERVED'
    public Reservation(User user, Guesthouse guesthouse, LocalDate checkinDate, LocalDate checkoutDate) {
        this.user = user;
        this.guesthouse = guesthouse;
        this.checkinDate = checkinDate;
        this.checkoutDate = checkoutDate;
        this.status = ReservationStatus.RESERVED; // 초기 상태 고정
    }

    // == 비즈니스 로직 ==
    public void cancel() {
        if (this.status == ReservationStatus.COMPLETED) {
            throw new IllegalStateException("이미 완료된 예약은 취소할 수 없습니다.");
        }
        this.status = ReservationStatus.CANCELLED;
    }

    public void complete() {
        if (this.status == ReservationStatus.CANCELLED) {
            throw new IllegalStateException("이미 취소된 예약은 완료 처리할 수 없습니다.");
        }
        this.status = ReservationStatus.COMPLETED;
    }
}
