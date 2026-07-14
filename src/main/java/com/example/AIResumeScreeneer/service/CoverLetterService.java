package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.AIResumeScreeneer.dto.AIAnalysisRequest;
import com.example.AIResumeScreeneer.dto.CoverLetterResponse;

@Service
public class CoverLetterService {

    public CoverLetterResponse generate(
            String resumeText,
            String jobDescription) {

        RestTemplate restTemplate =
                new RestTemplate();

        AIAnalysisRequest request =
                new AIAnalysisRequest();

        request.setResumeText(resumeText);
        request.setJobDescription(jobDescription);

        return restTemplate.postForObject(
                "http://localhost:8000/cover-letter",
                request,
                CoverLetterResponse.class);
    }
}