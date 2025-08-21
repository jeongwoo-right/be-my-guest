package com.bemyguest.backend.wish.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bemyguest.backend.wish.entity.Wish;
import com.bemyguest.backend.wish.repository.WishRepository;

@Service
public class WishService {
	
	@Autowired
	WishRepository wishRepository;
	
	// 찜 추가 ( + 메세지 반환)
	public String addWish(Long userId, Long guesthouseId) {
		Wish wish = new Wish();
		wish.setUserId(userId);
		wish.setGuesthouseId(guesthouseId);
	    wish.setCreatedAt(LocalDateTime.now());

		wishRepository.save(wish);
		
		return userId + "유저가 " + guesthouseId + "게스트하우스를 예약했습니다.";
		
	}
	
	
	// 사용자 찜 목록
	public List<Wish> getMyWishes(Long userId) {
		return wishRepository.findAllByUserId(userId);
	}
	
	
	// 찜 삭제
	@Transactional
	public String deleteWish(Long userId, Long guesthouseId) {
		wishRepository.deleteByUserIdAndGuesthouseId(userId, guesthouseId);
		return userId + "유저가 " + guesthouseId + "게스트하우스를 찜 해제했습니다.";
	}
}
