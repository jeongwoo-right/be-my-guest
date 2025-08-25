package com.bemyguest.backend.wish.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bemyguest.backend.reservation.repository.ReservationRepository;
import com.bemyguest.backend.review.repository.ReviewRepository;
import com.bemyguest.backend.user.entity.User;
import com.bemyguest.backend.user.repository.UserRepository;
import com.bemyguest.backend.user.security.CustomUserDetails;
import com.bemyguest.backend.wish.dto.CreateWishRequest;
import com.bemyguest.backend.wish.dto.DeleteWishRequest;
import com.bemyguest.backend.wish.dto.WishResponse;
import com.bemyguest.backend.wish.entity.Wish;
import com.bemyguest.backend.wish.repository.WishRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WishService {
	
	private final WishRepository wishRepository;
	private final UserRepository userRepository;
	
	// 찜 추가 ( + 메세지 반환)
	public String addWish(CustomUserDetails userDetails, CreateWishRequest request) {
		
		User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
		
		Long userId = userDetails.getId();
		Long guesthouseId = request.getGuesthouseId();
		
		Wish wish = new Wish();
		wish.setUserId(userId);
		wish.setGuesthouseId(guesthouseId);
	    wish.setCreatedAt(LocalDateTime.now());

		wishRepository.save(wish);
		
		return userId + "유저가 " + guesthouseId + "게스트하우스를 예약했습니다.";
		
	}
	
	
	// 사용자 찜 목록
	public List<WishResponse> getMyWishes(CustomUserDetails userDetails) {
		
		User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
		Long userId = userDetails.getId();
		
		List<Wish> wishes = wishRepository.findAllByUserId(userId);
		List<WishResponse> response = wishes.stream()
                .map(w -> new WishResponse(w.getGuesthouseId(), w.getCreatedAt()))
                .collect(Collectors.toList());				// 변환된 스트림을 다시 List<WishResponse> 형태로 모음
		
		return response;
	}
	
	
	// 찜 삭제
	@Transactional
	public String deleteWish(CustomUserDetails userDetails, Long wishId) {
		
		User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
		Long userId = userDetails.getId();
		Wish wish = wishRepository.findById(wishId)
                .orElseThrow(() -> new IllegalArgumentException("해당 Id의 찜을 찾을 수 없습니다."));
		if (!wish.getUserId().equals(userId)) {
            throw new SecurityException("찜을 삭제할 권한이 없습니다.");
        }
		Long guesthouseId = wish.getGuesthouseId();
		wishRepository.deleteById(wishId);
		return userId + "유저가 " + guesthouseId + "게스트하우스를 찜 해제했습니다.";
	}
}
