package com.example.AIResumeScreeneer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResumeAnalysisResponse {

    private Integer atsScore;

    private String skills;

    private String strengths;

    private String weaknesses;

    private String recommendations;
}