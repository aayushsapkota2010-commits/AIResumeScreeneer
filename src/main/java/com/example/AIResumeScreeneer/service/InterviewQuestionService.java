package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.InterviewQuestionResponse;

@Service
public class InterviewQuestionService {

    public InterviewQuestionResponse generate(
            String resumeText,
            String jobDescription) {

        String technical =
                """
                1. Explain Spring Boot Architecture
                2. Difference between JPA and Hibernate
                3. What is Dependency Injection?
                4. Explain REST API lifecycle
                5. Difference between SQL and NoSQL
                """;

        String hr =
                """
                1. Tell me about yourself
                2. Why should we hire you?
                3. What are your strengths?
                4. Describe a challenge you faced
                5. Where do you see yourself in 5 years?
                """;

        String project =
                """
                1. Explain your Student Management System
                2. Why did you choose Spring Boot?
                3. How did you design database schema?
                4. What security measures did you implement?
                5. How would you scale your application?
                """;

        return InterviewQuestionResponse.builder()
                .technicalQuestions(technical)
                .hrQuestions(hr)
                .projectQuestions(project)
                .build();
    }
}