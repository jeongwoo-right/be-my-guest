package com.bemyguest.backend.wish.controller;

import com.bemyguest.backend.docs.WishApiDocs;
import com.bemyguest.backend.user.security.CustomUserDetails;
import com.bemyguest.backend.wish.dto.ApiResponse;
import com.bemyguest.backend.wish.dto.CreateWishRequest;
import com.bemyguest.backend.wish.dto.DeleteWishRequest;
import com.bemyguest.backend.wish.dto.WishResponse;
import com.bemyguest.backend.wish.entity.Wish;
import com.bemyguest.backend.wish.service.WishService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/api/wish")
public class WishController implements WishApiDocs {

    private final WishService wishService;

    /**
     * [POST] 찜 추가
     * URL: /api/wish
     * Body: { "guesthouseId": 7 }
     * 201 Created + { "message": "..." }
     */
    @PostMapping
    public ResponseEntity<ApiResponse> addWish(@AuthenticationPrincipal CustomUserDetails userDetails,
    		@RequestBody CreateWishRequest request) {

    	String message = wishService.addWish(userDetails, request);
        
    	System.out.println("!!" + message);
        
    	return ResponseEntity
        		.status(HttpStatus.CREATED)
        		.body(new ApiResponse(message));
    }

    
    
    /**
     * [GET] 사용자 찜 목록 조회
     * URL: /api/wish
     * 200 OK + [ { "guesthouseId": ..., "createdAt": ... }, ... ]
     */
    
    @GetMapping
    public ResponseEntity<List<WishResponse>> getMyWishes(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<WishResponse> response = wishService.getMyWishes(userDetails);

        return ResponseEntity.ok(response);					// response 리스트를 HTTP 응답 바디에 담아 반환(200이면 Oㅏ)
    }

    
    
    /**
     * [DELETE] 특정 게스트하우스 찜 해제
     * URL: /api/wish/{wishId}
     * 200 OK + { "message": "..." }
     */
    @DeleteMapping("/{guesthouseId}")
    public ResponseEntity<ApiResponse> deleteWish(@AuthenticationPrincipal CustomUserDetails userDetails,
    		@PathVariable("guesthouseId") Long guesthouseId) {
        
    	String message = wishService.deleteWish(userDetails, guesthouseId);
    	System.out.println("[DELETE] " + message);
        return ResponseEntity.ok(new ApiResponse(message));
    }
}