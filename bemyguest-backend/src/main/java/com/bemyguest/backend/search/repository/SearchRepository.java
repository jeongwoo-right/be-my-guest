package com.bemyguest.backend.search.repository;

import com.bemyguest.backend.guesthouse.entity.Guesthouse;
import com.bemyguest.backend.guesthouse.entity.Region;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface SearchRepository extends Repository<Guesthouse, Long> {

    @Query(
        value = """
            SELECT g
              FROM Guesthouse g
             WHERE (:region IS NULL OR g.region = :region)
               AND g.capacity >= :guests
               AND NOT EXISTS (
                    SELECT 1
                      FROM com.bemyguest.backend.reservation.entity.Reservation r
                     WHERE r.guesthouse = g
                       AND r.status = com.bemyguest.backend.reservation.entity.ReservationStatus.RESERVED
                       AND r.checkinDate < :endDate
                       AND r.checkoutDate > :startDate
               )
            """,
        countQuery = """
            SELECT COUNT(g)
              FROM Guesthouse g
             WHERE (:region IS NULL OR g.region = :region)
               AND g.capacity >= :guests
               AND NOT EXISTS (
                    SELECT 1
                      FROM com.bemyguest.backend.reservation.entity.Reservation r
                     WHERE r.guesthouse = g
                       AND r.status = com.bemyguest.backend.reservation.entity.ReservationStatus.RESERVED
                       AND r.checkinDate < :endDate
                       AND r.checkoutDate > :startDate
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
