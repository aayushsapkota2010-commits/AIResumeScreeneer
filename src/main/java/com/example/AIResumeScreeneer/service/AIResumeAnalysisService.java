package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.config.AiEngineClient;
import com.example.AIResumeScreeneer.dto.AIAnalysisRequest;
import com.example.AIResumeScreeneer.dto.AIAnalysisResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AIResumeAnalysisService {

    private final AiEngineClient aiEngineClient;

    public AIAnalysisResponse analyze(
            String resumeText,
            String jobDescription) {

        AIAnalysisRequest request = new AIAnalysisRequest();
        request.setResumeText(resumeText);
        request.setJobDescription(jobDescription);

        return aiEngineClient.post(
                "/analyze",
                request,
                AIAnalysisResponse.class);
    }
}
