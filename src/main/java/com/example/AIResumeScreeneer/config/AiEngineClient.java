package com.example.AIResumeScreeneer.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AiEngineClient {

    private final RestTemplate restTemplate;

    @Value("${ai.engine.url:http://localhost:8000}")
    private String baseUrl;

    public <T> T post(String path, Object body, Class<T> responseType) {
        String url = baseUrl.replaceAll("/+$", "") + path;
        return restTemplate.postForObject(url, body, responseType);
    }
}
