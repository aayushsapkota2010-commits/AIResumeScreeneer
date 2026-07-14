package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.AIResumeScreeneer.dto.AIAnalysisRequest;
import com.example.AIResumeScreeneer.dto.AIAnalysisResponse;

@Service
public class AIResumeAnalysisService {

    public AIAnalysisResponse analyze(
            String resumeText,
            String jobDescription) {

        RestTemplate restTemplate =
                new RestTemplate();

        AIAnalysisRequest request =
                new AIAnalysisRequest();

        request.setResumeText(resumeText);
        request.setJobDescription(jobDescription);

        return restTemplate.postForObject(
                "http://localhost:8000/analyze",
                request,
                AIAnalysisResponse.class);
    }
}