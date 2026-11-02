package com.example.AIResumeScreeneer.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.config.AiEngineClient;
import com.example.AIResumeScreeneer.dto.JobRecommendationResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobRecommendationService {

    private final AiEngineClient aiEngineClient;

    public JobRecommendationResponse recommend(String resumeText) {
        return aiEngineClient.post(
                "/recommend-jobs",
                Map.of("resumeText", resumeText),
                JobRecommendationResponse.class);
    }
}
