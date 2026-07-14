package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.AIResumeScreeneer.dto.JobRecommendationResponse;

@Service
public class JobRecommendationService {
    public JobRecommendationResponse recommend(String resumeText)
    {
        RestTemplate restTemplate=new RestTemplate();
         return restTemplate.postForObject(
                "http://localhost:8000/recommend-jobs",
                java.util.Map.of(
                        "resumeText",
                        resumeText),
                JobRecommendationResponse.class);
    }
    
}
