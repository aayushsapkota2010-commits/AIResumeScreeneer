package com.example.AIResumeScreeneer.config;

import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

@Component
public class GroqClient {

    private static final Logger log = LoggerFactory.getLogger(GroqClient.class);

    private final RestTemplate restTemplate;

    @Value("${ai.groq.api-key:}")
    private String apiKey;

    @Value("${ai.groq.url:https://api.groq.com/openai/v1/chat/completions}")
    private String url;

    @Value("${ai.groq.model:llama-3.3-70b-versatile}")
    private String model;

    @Value("${ai.groq.fallback-models:llama-3.1-8b-instant}")
    private String fallbackModels;

    public GroqClient() {
        SimpleClientHttpRequestFactory factory =
                new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(10));
        factory.setReadTimeout(Duration.ofSeconds(60));
        this.restTemplate = new RestTemplate(factory);
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    public String ask(String prompt) {
        if (!isConfigured()) {
            throw new IllegalStateException("Groq API key is not configured.");
        }

        RestClientException lastError = null;

        for (String currentModel : models()) {
            try {
                return askModel(currentModel, prompt);
            } catch (RestClientException error) {
                lastError = error;
                log.warn(
                        "Groq request failed for model {}: {}",
                        currentModel,
                        error.getMessage()
                );

                if (!shouldTryNextModel(error)) {
                    break;
                }
            }
        }

        throw lastError != null
                ? lastError
                : new IllegalStateException("Groq request failed.");
    }

    private String askModel(String currentModel, String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey.trim());

        Map<String, Object> body = Map.of(
                "model", currentModel,
                "messages", List.of(
                        Map.of(
                                "role", "system",
                                "content",
                                "You are a helpful, accurate AI resume and career assistant. "
                                        + "Never invent personal facts that are not in the resume."
                        ),
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.4,
                "max_tokens", 2048
        );

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(body, headers);

        @SuppressWarnings("unchecked")
        Map<String, Object> response =
                restTemplate.postForObject(url, entity, Map.class);

        String answer = extractAnswer(response);

        if (answer == null || answer.isBlank()) {
            throw new IllegalStateException("Groq returned an empty response.");
        }

        return answer;
    }

    private String extractAnswer(Map<String, Object> response) {
        if (response == null) {
            return null;
        }

        Object choicesValue = response.get("choices");

        if (!(choicesValue instanceof List<?> choices) || choices.isEmpty()) {
            return null;
        }

        Object firstChoice = choices.get(0);

        if (!(firstChoice instanceof Map<?, ?> choice)) {
            return null;
        }

        Object messageValue = choice.get("message");

        if (!(messageValue instanceof Map<?, ?> message)) {
            return null;
        }

        Object content = message.get("content");

        return content instanceof String text ? text : null;
    }

    private boolean shouldTryNextModel(RestClientException error) {
        if (error instanceof RestClientResponseException responseError) {
            int status = responseError.getStatusCode().value();
            return status == 400 || status == 404 || status == 422;
        }

        return false;
    }

    private List<String> models() {
        Set<String> unique = new LinkedHashSet<>();
        addModel(unique, model);
        addModel(unique, "llama-3.3-70b-versatile");
        addModel(unique, "llama-3.1-8b-instant");
        addModel(unique, "openai/gpt-oss-120b");
        addModel(unique, "meta-llama/llama-4-scout-17b-16e-instruct");

        if (fallbackModels != null) {
            for (String candidate : fallbackModels.split(",")) {
                addModel(unique, candidate);
            }
        }

        return new ArrayList<>(unique);
    }

    private void addModel(Set<String> models, String candidate) {
        if (candidate != null && !candidate.isBlank()) {
            models.add(candidate.trim());
        }
    }
}
