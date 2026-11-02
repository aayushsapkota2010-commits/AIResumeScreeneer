package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.config.AiEngineClient;
import com.example.AIResumeScreeneer.dto.AIAnalysisRequest;
import com.example.AIResumeScreeneer.dto.MockInterviewResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MockInterviewService {

    private final AiEngineClient aiEngineClient;

    public MockInterviewResponse generate(
            String resumeText,
            String jobDescription) {

        AIAnalysisRequest request = new AIAnalysisRequest();
        request.setResumeText(resumeText);
        request.setJobDescription(jobDescription);

        return aiEngineClient.post(
                "/mock-interview",
                request,
                MockInterviewResponse.class);
    }
}
