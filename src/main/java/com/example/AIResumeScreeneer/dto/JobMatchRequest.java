package com.example.AIResumeScreeneer.dto;

import lombok.Data;

@Data
public class JobMatchRequest {

    private Long resumeId;

    private String jobDescription;
}