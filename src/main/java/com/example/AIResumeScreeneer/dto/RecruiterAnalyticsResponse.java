package com.example.AIResumeScreeneer.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecruiterAnalyticsResponse {

    private long totalResumes;

    private double averageAtsScore;

    private long shortlisted;

    private long selected;

    private long rejected;

    private String topSkill;
}