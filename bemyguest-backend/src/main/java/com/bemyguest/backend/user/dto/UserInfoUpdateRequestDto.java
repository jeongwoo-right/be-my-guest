package com.bemyguest.backend.user.dto;

import com.bemyguest.backend.user.entity.Gender;

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
public class UserInfoUpdateRequestDto {
	private String nickname;
    private String phone;
    private Gender gender;
}
