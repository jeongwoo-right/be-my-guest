package com.bemyguest.backend.guesthouse.repository;

import com.bemyguest.backend.guesthouse.entity.Guesthouse;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;  // <-- add this import
import java.util.Optional;

public interface GuesthouseRepository extends JpaRepository<Guesthouse, Long> {

    // Option A: EntityGraph + simple JPQL
	@EntityGraph(attributePaths = "facilities")
	@Query("select g from Guesthouse g where g.id = :id")
	Optional<Guesthouse> findWithFacilitiesById(@Param("id") Long id);

    
    // Option B (alternative): explicit join fetch (also needs @Param)
    // @Query("select g from Guesthouse g left join fetch g.facilities where g.id = :id")
    // Optional<Guesthouse> findWithFacilitiesById(@Param("id") Long id);
}
