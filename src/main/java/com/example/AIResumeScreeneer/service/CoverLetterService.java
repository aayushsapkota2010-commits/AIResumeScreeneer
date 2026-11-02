package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.config.AiEngineClient;
import com.example.AIResumeScreeneer.dto.AIAnalysisRequest;
import com.example.AIResumeScreeneer.dto.CoverLetterResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CoverLetterService {

    private final AiEngineClient aiEngineClient;

    public CoverLetterResponse generate(
            String resumeText,
            String jobDescription) {

        AIAnalysisRequest request = new AIAnalysisRequest();
        request.setResumeText(resumeText);
        request.setJobDescription(jobDescription);

        return aiEngineClient.post(
                "/cover-letter",
                request,
                CoverLetterResponse.class);
    }
}
