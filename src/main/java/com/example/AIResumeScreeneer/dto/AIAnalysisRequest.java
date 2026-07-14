package com.example.AIResumeScreeneer.dto;

import lombok.Data;

@Data
public class AIAnalysisRequest {

    private String resumeText;

    private String jobDescription;
}