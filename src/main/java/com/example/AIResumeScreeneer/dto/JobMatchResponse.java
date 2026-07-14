package com.example.AIResumeScreeneer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JobMatchResponse {

    private int matchPercentage;

    private String matchedSkills;

    private String missingSkills;

    private String recommendation;
}