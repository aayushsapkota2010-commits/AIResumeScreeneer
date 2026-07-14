package com.example.AIResumeScreeneer.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {

    private long totalResumes;

    private double averageAtsScore;

    private int highestAtsScore;

    private int highestMatchScore;

    private long shortlisted;

    private long selected;

    private long rejected;

    private String topSkill;
}