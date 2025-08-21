package com.bemyguest.backend.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bemyguest.backend.user.dto.LoginRequestDto;
import com.bemyguest.backend.user.dto.SignupRequestDto;
import com.bemyguest.backend.user.dto.UserInfoReadResponseDto;
import com.bemyguest.backend.user.dto.UserInfoUpdateRequestDto;
import com.bemyguest.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
	
	private final UserService userService;
	
	// 1. 회원가입 api
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequestDto signupRequestDto) {
        userService.signup(signupRequestDto);
        return ResponseEntity.ok("회원가입 성공");
    }

    // 2. 로그인 api
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto) {
        String token = userService.login(loginRequestDto);
        return ResponseEntity.ok(token);
    }

    // 3. 내 정보 조회 api
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(@RequestHeader("Authorization") String token) {
        UserInfoReadResponseDto userInfo = userService.getMyInfo(token);
        return ResponseEntity.ok(userInfo);
    }

    // 4. 내 정보 수정 api
    @PutMapping("/me")
    public ResponseEntity<?> updateMyInfo(@RequestHeader("Authorization") String token,
                                          @RequestBody UserInfoUpdateRequestDto updateDto) {
        userService.updateMyInfo(token, updateDto);
        return ResponseEntity.ok("회원정보 수정 완료");
    }

}
