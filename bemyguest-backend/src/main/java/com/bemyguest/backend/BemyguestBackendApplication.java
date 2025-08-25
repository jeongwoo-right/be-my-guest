package com.bemyguest.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
@EnableJpaAuditing
public class BemyguestBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BemyguestBackendApplication.class, args);
	}

}
