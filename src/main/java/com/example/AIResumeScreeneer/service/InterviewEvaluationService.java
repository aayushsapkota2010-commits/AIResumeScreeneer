package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.AIResumeScreeneer.dto.InterviewEvaluationRequest;
import com.example.AIResumeScreeneer.dto.InterviewEvaluationResponse;

@Service
public class InterviewEvaluationService {

    public InterviewEvaluationResponse evaluate(
            String question,
            String answer) {

        RestTemplate restTemplate =
                new RestTemplate();

        InterviewEvaluationRequest request =
                new InterviewEvaluationRequest();

        request.setQuestion(question);
        request.setAnswer(answer);

        return restTemplate.postForObject(
                "http://localhost:8000/evaluate-answer",
                request,
                InterviewEvaluationResponse.class);
    }
}