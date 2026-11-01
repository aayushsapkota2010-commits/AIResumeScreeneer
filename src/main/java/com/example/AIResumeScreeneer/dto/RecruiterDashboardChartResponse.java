package com.example.AIResumeScreeneer.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecruiterDashboardChartResponse {

    private long applied;
    private long screening;
    private long shortlisted;
    private long interview;
    private long selected;
    private long rejected;
    private long withdrawn;
}