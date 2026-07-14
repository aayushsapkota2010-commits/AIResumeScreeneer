package com.example.AIResumeScreeneer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JobRankingResponse {

    private String jobTitle;

    private int matchPercentage;
}