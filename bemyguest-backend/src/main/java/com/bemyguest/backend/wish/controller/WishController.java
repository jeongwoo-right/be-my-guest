package com.bemyguest.backend.wish.controller;

import com.bemyguest.backend.wish.dto.ApiResponse;
import com.bemyguest.backend.wish.dto.CreateWishRequest;
import com.bemyguest.backend.wish.dto.DeleteWishRequest;
import com.bemyguest.backend.wish.dto.WishResponse;
import com.bemyguest.backend.wish.entity.Wish;
import com.bemyguest.backend.wish.service.WishService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/api/user/{userId}/wish")
public class WishController {

    private final WishService wishService;

    /**
     * [POST] 찜 추가
     * URL: /api/use/{userId}/wish
     * Body: { "guesthouseId": 7 }
     * 201 Created + { "message": "..." }
     */
    @PostMapping
    public ResponseEntity<ApiResponse> addWish(@PathVariable("userId") Long userId, @RequestBody CreateWishRequest request) {

    	String message = wishService.addWish(userId, request.getGuesthouseId());
        
    	System.out.println("!!" + message);
        
    	return ResponseEntity
        		.status(HttpStatus.CREATED)
        		.body(new ApiResponse(message));
    }

    
    
    /**
     * [GET] 사용자 찜 목록 조회
     * URL: /api/user/{userId}/wish
     * 200 OK + [ { "guesthouseId": ..., "createdAt": ... }, ... ]
     */
    
    @GetMapping
    public ResponseEntity<List<WishResponse>> getMyWishes(@PathVariable("userId") Long userId) {
        // Service는 현재 List<Wish>를 반환하므로, Controller에서 DTO로 변환
        List<Wish> wishes = wishService.getMyWishes(userId);
        
        List<WishResponse> response = wishes.stream()
                .map(w -> new WishResponse(w.getGuesthouseId(), w.getCreatedAt()))
                .collect(Collectors.toList());				// 변환된 스트림을 다시 List<WishResponse> 형태로 모음

        return ResponseEntity.ok(response);					// response 리스트를 HTTP 응답 바디에 담아 반환(200이면 Oㅏ)
    }

    
    
    /**
     * [DELETE] 특정 게스트하우스 찜 해제
     * URL: /api/user/{userId}/wish/{guesthouseId}
     * 200 OK + { "message": "..." }
     */
    @DeleteMapping
    public ResponseEntity<ApiResponse> deleteWish(@PathVariable("userId") Long userId, @RequestBody DeleteWishRequest req) {
        
    	String message = wishService.deleteWish(userId, req.getGuesthouseId());
    	System.out.println("[DELETE] " + message);
        return ResponseEntity.ok(new ApiResponse(message));
    }
}
