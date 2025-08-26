package com.bemyguest.backend.wish.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateWishRequest {
	@Schema(description = "게스트하우스 ID", example = "1")
    private Long guesthouseId;
}
