package com.bemyguest.backend.review.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.bemyguest.backend.guesthouse.entity.Guesthouse;
import com.bemyguest.backend.user.entity.User;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "reviews")
@EntityListeners(AuditingEntityListener.class) // Auditing 활성화
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    // Reservation, User, Guesthouse Entity가 이미 존재한다고 가정합니다.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guesthouse_id", nullable = false)
    private Guesthouse guesthouse;

    @Column(nullable = false)
    private int rating;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // 생성자, 수정 메서드 등 필요에 따라 추가
    public Review(Reservation reservation, User user, Guesthouse guesthouse, int rating, String content) {
        this.reservation = reservation;
        this.user = user;
        this.guesthouse = guesthouse;
        this.rating = rating;
        this.content = content;
    }
    
    public void update(int rating, String content) {
        this.rating = rating;
        this.content = content;
    }
}