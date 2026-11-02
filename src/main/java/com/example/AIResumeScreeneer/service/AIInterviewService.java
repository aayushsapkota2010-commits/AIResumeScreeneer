package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.config.AiEngineClient;
import com.example.AIResumeScreeneer.dto.InterviewQuestionRequest;
import com.example.AIResumeScreeneer.dto.InterviewQuestionResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AIInterviewService {

    private final AiEngineClient aiEngineClient;

    public InterviewQuestionResponse generateQuestions(String resumeText) {
        InterviewQuestionRequest request = new InterviewQuestionRequest();
        request.setResumeText(resumeText);

        return aiEngineClient.post(
                "/interview-questions",
                request,
                InterviewQuestionResponse.class
        );
    }
}
