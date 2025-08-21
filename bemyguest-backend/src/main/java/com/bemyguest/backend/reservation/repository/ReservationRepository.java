package com.bemyguest.backend.reservation.repository;

import com.bemyguest.backend.reservation.entity.Reservation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
	List<Reservation> findAllByUserIdOrderByCreatedAtDesc(long userId);
}