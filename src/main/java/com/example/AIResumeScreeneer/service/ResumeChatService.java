
package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.AIResumeScreeneer.dto.ResumeChatRequest;
import com.example.AIResumeScreeneer.dto.ResumeChatResponse;

@Service
public class ResumeChatService {

    private final RestTemplate restTemplate = new RestTemplate();

    public ResumeChatResponse askQuestion(
            String resumeText,
            String question) {

        ResumeChatRequest request = new ResumeChatRequest();

        request.setResumeText(resumeText);
        request.setQuestion(question);

        return restTemplate.postForObject(
                "http://localhost:8000/resume-chat",
                request,
                ResumeChatResponse.class
        );
    }
}
