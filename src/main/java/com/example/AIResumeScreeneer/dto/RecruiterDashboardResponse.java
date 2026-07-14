package com.example.AIResumeScreeneer.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecruiterDashboardResponse {

    private int totalCandidates;

    private int shortlistedCandidates;

    private double averageATS;

    private int highestATS;
}