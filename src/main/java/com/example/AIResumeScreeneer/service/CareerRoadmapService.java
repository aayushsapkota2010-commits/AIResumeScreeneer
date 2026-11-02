package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.config.AiEngineClient;
import com.example.AIResumeScreeneer.dto.RoadmapRequest;
import com.example.AIResumeScreeneer.dto.RoadmapResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CareerRoadmapService {

    private final AiEngineClient aiEngineClient;

    public RoadmapResponse generate(String resumeText) {
        RoadmapRequest request = new RoadmapRequest();
        request.setResumeText(resumeText);

        return aiEngineClient.post(
                "/roadmap",
                request,
                RoadmapResponse.class);
    }
}
