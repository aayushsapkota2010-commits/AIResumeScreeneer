package com.example.AIResumeScreeneer.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecruiterDashboardChartResponse {

    private long applied;
    private long shortlisted;
    private long interviewed;
    private long selected;
    private long rejected;
}