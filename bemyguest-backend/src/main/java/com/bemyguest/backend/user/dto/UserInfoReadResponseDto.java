package com.bemyguest.backend.user.dto;

import java.time.LocalDateTime;

import com.bemyguest.backend.user.entity.Gender;
import com.bemyguest.backend.user.entity.Role;

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
	private String email;
    private String nickname;
    private String phone;
    private Gender gender;
    private Role role;
    private LocalDateTime createdAt;
}
