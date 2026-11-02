package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.config.AiEngineClient;
import com.example.AIResumeScreeneer.dto.ResumeChatRequest;
import com.example.AIResumeScreeneer.dto.ResumeChatResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResumeChatService {

    private final AiEngineClient aiEngineClient;

    public ResumeChatResponse askQuestion(
            String resumeText,
            String question) {

        ResumeChatRequest request = new ResumeChatRequest();
        request.setResumeText(resumeText);
        request.setQuestion(question);

        return aiEngineClient.post(
                "/resume-chat",
                request,
                ResumeChatResponse.class
        );
    }
}
