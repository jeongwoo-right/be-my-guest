package com.bemyguest.backend.user.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bemyguest.backend.user.dto.LoginRequestDto;
import com.bemyguest.backend.user.dto.SignupRequestDto;
import com.bemyguest.backend.user.dto.UserInfoReadResponseDto;
import com.bemyguest.backend.user.dto.UserInfoUpdateRequestDto;
import com.bemyguest.backend.user.entity.Role;
import com.bemyguest.backend.user.entity.User;
import com.bemyguest.backend.user.repository.UserRepository;
import com.bemyguest.backend.user.security.CustomUserDetails;
import com.bemyguest.backend.user.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	
	private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /*
     * 회원가입
     */
    public void signup(SignupRequestDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword())); // 암호화
        user.setNickname(dto.getNickname());
        user.setPhone(dto.getPhone());
        user.setGender(dto.getGender());
        user.setRole(Role.USER);
        userRepository.save(user);
    }

    /*
     * 로그인
     */
    public String login(LoginRequestDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 이메일입니다."));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return jwtTokenProvider.createToken(user.getEmail(), user.getRole().name());
    }
    
    /*
     * 내 정보 조회
     */
    public UserInfoReadResponseDto getMyInfo(CustomUserDetails userDetails) {
        // 토큰에서 이메일 추출
//        String email = jwtTokenProvider.getEmail(userDetails);
    	String email = userDetails.getUsername();

        // DB에서 사용자 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // Entity → DTO 변환
        return new UserInfoReadResponseDto(
                user.getEmail(),
                user.getNickname(),
                user.getPhone(),
                user.getGender(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
    
    /*
     * 내 정보 수정
     */
    public void updateMyInfo(CustomUserDetails userDetails, UserInfoUpdateRequestDto dto) {
        String email = userDetails.getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 변경 가능한 필드만 업데이트
        if (dto.getNickname() != null) {
            user.setNickname(dto.getNickname());
        }
        if (dto.getPhone() != null) {
            user.setPhone(dto.getPhone());
        }
        if (dto.getGender() != null) {
            user.setGender(dto.getGender());
        }

        userRepository.save(user);
    }


}
