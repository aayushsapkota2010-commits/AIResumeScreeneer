package com.example.AIResumeScreeneer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AiResumeScreeneerApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiResumeScreeneerApplication.class, args);
	}

}
