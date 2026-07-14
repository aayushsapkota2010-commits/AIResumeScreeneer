package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.AIResumeScreeneer.dto.RoadmapRequest;
import com.example.AIResumeScreeneer.dto.RoadmapResponse;

@Service
public class CareerRoadmapService {

    public RoadmapResponse generate(
            String resumeText) {

        RestTemplate restTemplate =
                new RestTemplate();

        RoadmapRequest request =
                new RoadmapRequest();

        request.setResumeText(
                resumeText);

        return restTemplate.postForObject(
                "http://localhost:8000/roadmap",
                request,
                RoadmapResponse.class);
    }
}