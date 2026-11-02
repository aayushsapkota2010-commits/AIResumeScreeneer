package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.config.AiEngineClient;
import com.example.AIResumeScreeneer.dto.InterviewEvaluationRequest;
import com.example.AIResumeScreeneer.dto.InterviewEvaluationResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InterviewEvaluationService {

    private final AiEngineClient aiEngineClient;

    public InterviewEvaluationResponse evaluate(
            String question,
            String answer) {

        InterviewEvaluationRequest request =
                new InterviewEvaluationRequest();

        request.setQuestion(question);
        request.setAnswer(answer);

        return aiEngineClient.post(
                "/evaluate-answer",
                request,
                InterviewEvaluationResponse.class);
    }
}
