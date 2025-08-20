package com.bemyguest.backend.search.repository;

import com.bemyguest.backend.search.entity.Guesthouse;
import com.bemyguest.backend.search.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;   // ⬅️ LocalDate 임포트 꼭 필요!
import java.util.List;

public interface GuesthouseRepository extends JpaRepository<Guesthouse, Long> {

    // 기본 검색 (region/guests + 가격 오름차순)
    @Query("""
        SELECT g
        FROM Guesthouse g
        WHERE (:region IS NULL OR g.region = :region)
          AND g.capacity >= :guests
        ORDER BY g.price ASC
    """)
    List<Guesthouse> findByBasicFilters(
            @Param("region") Region region,
            @Param("guests") int guests
    );

    // 예약 겹침 제외 검색
    @Query("""
        SELECT g
        FROM Guesthouse g
        WHERE (:region IS NULL OR g.region = :region)
          AND g.capacity >= :guests
          AND NOT EXISTS (
              SELECT r
              FROM Reservation r
              WHERE r.guesthouse = g
                AND r.status = com.bemyguest.backend.search.entity.Reservation.ReservationStatus.RESERVED
                AND r.checkInDate < :endDate
                AND r.checkOutDate > :startDate
          )
        ORDER BY g.price ASC
    """)
    List<Guesthouse> findAvailableGuesthouses(
            @Param("region") Region region,
            @Param("guests") int guests,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
