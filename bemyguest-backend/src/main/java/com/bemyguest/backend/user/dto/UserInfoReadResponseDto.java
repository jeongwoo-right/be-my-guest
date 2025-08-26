package com.bemyguest.backend.user.dto;

import java.time.LocalDateTime;

import com.bemyguest.backend.user.entity.Gender;
import com.bemyguest.backend.user.entity.Role;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfoReadResponseDto {
	@Schema(description = "이메일 (아이디 겸용)", example = "gildong@gmail.com")
	private String email;
	@Schema(description = "닉네임", example = "hgd")
    private String nickname;
	@Schema(description = "전화번호 (선택 사항)", example = "010-1234-5678")
    private String phone;
	@Schema(description = "성별 (선택 사항)", example = "M")
    private Gender gender;
	@Schema(description = "회원 유형", example = "USER")
    private Role role;
	@Schema(description = "가입 날짜", example = "2025-08-22 15:15:03")
    private LocalDateTime createdAt;
}
