package com.bemyguest.backend.reservation.repository;

import com.bemyguest.backend.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // 기본적인 CRUD 메서드는 JpaRepository가 모두 제공합니다.
}