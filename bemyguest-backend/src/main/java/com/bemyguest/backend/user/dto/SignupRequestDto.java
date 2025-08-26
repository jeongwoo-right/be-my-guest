package com.bemyguest.backend.user.dto;

import com.bemyguest.backend.user.entity.Gender;

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
public class SignupRequestDto {
	@Schema(description = "이메일 (아이디 겸용이므로 중복 불가)", example = "gildong@gmail.com")
	private String email;
	@Schema(description = "비밀번호", example = "hong")
    private String password;
	@Schema(description = "닉네임", example = "hgd")
    private String nickname;
	@Schema(description = "전화번호 (선택 사항)", example = "010-1234-5678")
    private String phone;
	@Schema(description = "성별 (선택 사항)", example = "M")
    private Gender gender;
}
