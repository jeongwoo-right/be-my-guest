package com.bemyguest.backend.wish.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="wishes")
public class Wish {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;					// 찜 ID
	
	private Long userId;					// 사용자 ID
	private Long guesthouseId;			// 게스트하우스 ID
	private LocalDateTime createdAt;	// 찜 날짜+시각
	
}
