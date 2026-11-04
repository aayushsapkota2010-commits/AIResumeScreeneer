package com.example.AIResumeScreeneer.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class AiEngineClient {

    private final RestTemplate restTemplate;

    @Value("${ai.engine.url:https://airesumescreeneer.onrender.com}")
    private String baseUrl;

    public <T> T post(String path, Object body, Class<T> responseType) {
        String cleanBaseUrl = baseUrl != null ? baseUrl.replaceAll("/+$", "") : "https://airesumescreeneer.onrender.com";
        String url = cleanBaseUrl + path;
        log.info("Calling AI Engine URL: {}", url);
        return restTemplate.postForObject(url, body, responseType);
    }
}