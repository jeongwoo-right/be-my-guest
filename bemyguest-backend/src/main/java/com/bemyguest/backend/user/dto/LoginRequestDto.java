package com.bemyguest.backend.user.dto;

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
public class LoginRequestDto {
	@Schema(description = "이메일 (아이디 겸용)", example = "gildong@gmail.com")
	private String email;
	@Schema(description = "비밀번호", example = "hong")
    private String password;
}
