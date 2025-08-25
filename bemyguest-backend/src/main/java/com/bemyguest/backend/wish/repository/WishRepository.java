package com.bemyguest.backend.wish.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bemyguest.backend.wish.entity.Wish;

@Repository
public interface WishRepository extends JpaRepository<Wish, Long> {
	
	// [GET] 사용자 찜 목록
	List<Wish> findAllByUserId(Long userId);									// select * from wishes where user_id = 3
	
	// [DELETE] 찜 삭제
	long deleteByUserIdAndGuesthouseId(Long userId, Long guesthouseId); 		// DELETE FROM wishes WHERE user_id = 3 AND guesthouse_id = 7;

	void deleteById(Long wishId);
	Optional<Wish> findById(Long wishId);

}