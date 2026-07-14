package com.example.AIResumeScreeneer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InterviewQuestionResponse {

    private String technicalQuestions;

    private String hrQuestions;

    private String projectQuestions;
}