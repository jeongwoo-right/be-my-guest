package com.bemyguest.backend.search.repository;

import com.bemyguest.backend.search.entity.Guesthouse;
import com.bemyguest.backend.search.entity.Region;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface GuesthouseRepository extends JpaRepository<Guesthouse, Long> {

    /**
     * 예약 겹침을 제외하고, 기본 조건(region/guests)을 만족하는 게스트하우스 페이징 조회.
     * 정렬은 Pageable로 위임한다. (JPQL에 ORDER BY 없음)
     *
     * 예약 겹침 제외 조건:
     *  - (existing.checkInDate < :endDate) AND (existing.checkOutDate > :startDate)
     *  - status = RESERVED 인 예약만 충돌로 간주
     */
    @Query(
        value = """
            SELECT g
              FROM Guesthouse g
             WHERE (:region IS NULL OR g.region = :region)
               AND g.capacity >= :guests
               AND NOT EXISTS (
                    SELECT 1
                      FROM com.bemyguest.backend.search.entity.Reservation r
                     WHERE r.guesthouse = g
                       AND r.status = com.bemyguest.backend.search.entity.Reservation.ReservationStatus.RESERVED
                       AND r.checkInDate < :endDate
                       AND r.checkOutDate > :startDate
               )
            """,
        countQuery = """
            SELECT COUNT(g)
              FROM Guesthouse g
             WHERE (:region IS NULL OR g.region = :region)
               AND g.capacity >= :guests
               AND NOT EXISTS (
                    SELECT 1
                      FROM com.bemyguest.backend.search.entity.Reservation r
                     WHERE r.guesthouse = g
                       AND r.status = com.bemyguest.backend.search.entity.Reservation.ReservationStatus.RESERVED
                       AND r.checkInDate < :endDate
                       AND r.checkOutDate > :startDate
               )
            """
    )
    Page<Guesthouse> findAvailableGuesthouses(
            @Param("region") Region region,
            @Param("guests") int guests,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );
}
