package com.example.AIResumeScreeneer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResumeImprovementResponse {

    private String profileSummary;

    private String missingSkills;

    private String recommendedProjects;

    private String certifications;

    private String improvementPlan;
}