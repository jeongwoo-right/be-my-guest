package com.bemyguest.backend.guesthouse.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "guesthouses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Guesthouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 255)
    private String address;

    // ★ 변경: RegionConverter 제거 → Enum 문자열로 직접 저장
    @Enumerated(EnumType.STRING)
    @Column(name = "region", nullable = false, length = 20)
    private Region region;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    // 가격: DECIMAL(10,2) 권장
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    // 설명: TEXT
    @Column(columnDefinition = "TEXT")
    private String description;

    // 친구 코드 유지: 1:1 연관관계 (지연 로딩)
    @OneToOne(mappedBy = "guesthouse", fetch = FetchType.LAZY, optional = true)
    private Facilities facilities;

    // ★ 추가 유지: 평점 집계 컬럼 (리뷰팀이 갱신)
    @Column(name = "rating_avg", precision = 3, scale = 2) // 예: 4.37
    private BigDecimal ratingAvg;

    @Column(name = "rating_count")
    private Integer ratingCount;
}
