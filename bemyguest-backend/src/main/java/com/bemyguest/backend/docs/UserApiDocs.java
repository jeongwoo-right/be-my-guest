package com.bemyguest.backend.docs;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestBody;

import com.bemyguest.backend.user.dto.LoginRequestDto;
import com.bemyguest.backend.user.dto.LoginResponseDto;
import com.bemyguest.backend.user.dto.SignupRequestDto;
import com.bemyguest.backend.user.dto.UserInfoReadResponseDto;
import com.bemyguest.backend.user.dto.UserInfoUpdateRequestDto;
import com.bemyguest.backend.user.security.CustomUserDetails;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "1. 회원 API", description = "회원 정보 조회 및 수정 API")
public interface UserApiDocs {
	
	@Operation(summary = "회원가입", description = "새로운 회원으로 추가됩니다.", security = {})
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "가입 성공"),
    })
	ResponseEntity<String> signup(@RequestBody SignupRequestDto signupRequestDto);
	
	@Operation(summary = "로그인", description = "이메일과 비밀번호를 입력해 로그인합니다.", security = {})
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "로그인 성공"),
    })
	ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto);
	
	@Operation(summary = "내 정보 조회", description = "로그인된 회원의 기본 정보를 조회합니다.")
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "내 정보 조회 성공"),
    })
	ResponseEntity<UserInfoReadResponseDto> getMyInfo(@AuthenticationPrincipal CustomUserDetails userDetails);
	
	@Operation(summary = "내 정보 수정", description = "로그인된 회원의 기본 정보를 수정합니다.")
	@ApiResponses({
        @ApiResponse(responseCode = "200", description = "내 정보 수정 성공"),
    })
	ResponseEntity<String> updateMyInfo(@AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UserInfoUpdateRequestDto updateDto);

}
