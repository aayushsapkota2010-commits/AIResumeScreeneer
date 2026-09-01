package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.AIResumeScreeneer.dto.InterviewQuestionRequest;
import com.example.AIResumeScreeneer.dto.InterviewQuestionResponse;

@Service
public class AIInterviewService {

    public InterviewQuestionResponse generateQuestions(

            String resumeText

    ) {

        RestTemplate restTemplate = new RestTemplate();

        InterviewQuestionRequest request =
                new InterviewQuestionRequest();

        request.setResumeText(resumeText);

        return restTemplate.postForObject(

                "http://localhost:8000/interview-questions",

                request,

                InterviewQuestionResponse.class

        );

    }

}