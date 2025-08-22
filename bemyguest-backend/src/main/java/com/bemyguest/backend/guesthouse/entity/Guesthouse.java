package com.bemyguest.backend.guesthouse.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;

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
    
  //== 평점 계산 비즈니스 로직 ==//

    /**
     * 리뷰가 새로 추가될 때 평점을 갱신합니다.
     * @param newRating 새로 추가된 리뷰의 평점
     */
    public void addReview(int newRating) {
        BigDecimal totalScore = this.ratingAvg.multiply(new BigDecimal(this.ratingCount));
        this.ratingCount++;
        this.ratingAvg = totalScore.add(new BigDecimal(newRating))
                                  .divide(new BigDecimal(this.ratingCount), 2, RoundingMode.HALF_UP);
    }

    /**
     * 기존 리뷰가 수정될 때 평점을 갱신합니다.
     * @param oldRating 수정 전 평점
     * @param newRating 수정 후 평점
     */
    public void updateReview(int oldRating, int newRating) {
        if (this.ratingCount == 0) return; // 예외 케이스 처리
        BigDecimal totalScore = this.ratingAvg.multiply(new BigDecimal(this.ratingCount));
        totalScore = totalScore.subtract(new BigDecimal(oldRating)).add(new BigDecimal(newRating));
        this.ratingAvg = totalScore.divide(new BigDecimal(this.ratingCount), 2, RoundingMode.HALF_UP);
    }

    /**
     * 기존 리뷰가 삭제될 때 평점을 갱신합니다.
     * @param deletedRating 삭제될 리뷰의 평점
     */
    public void deleteReview(int deletedRating) {
        if (this.ratingCount <= 1) { // 마지막 리뷰가 삭제될 경우
            this.ratingCount = 0;
            this.ratingAvg = BigDecimal.ZERO;
        } else {
            BigDecimal totalScore = this.ratingAvg.multiply(new BigDecimal(this.ratingCount));
            this.ratingCount--;
            this.ratingAvg = totalScore.subtract(new BigDecimal(deletedRating))
                                      .divide(new BigDecimal(this.ratingCount), 2, RoundingMode.HALF_UP);
        }
    }
}
