package com.bemyguest.backend.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SwaggerConfiguration {
	
	@Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("게스트하우스 서비스 API")
                .version("v1.0")
                .description("회원, 숙소, 예약, 리뷰, 찜 관리 API 명세서"))
	     	// JWT Security 설정 추가
	        .addSecurityItem(new SecurityRequirement().addList("BearerAuth"))
	        .components(new Components()
	            .addSecuritySchemes("BearerAuth",
	                new SecurityScheme()
	                    .name("Authorization")
	                    .type(SecurityScheme.Type.HTTP)
	                    .scheme("bearer")
	                    .bearerFormat("JWT")
	                    .in(SecurityScheme.In.HEADER)
	                    .description("JWT 토큰을 입력하세요. 예) eyJhbGciOi...")));
    }

}
