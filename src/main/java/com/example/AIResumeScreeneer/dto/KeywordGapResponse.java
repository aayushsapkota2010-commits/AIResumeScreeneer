package com.example.AIResumeScreeneer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KeywordGapResponse {
    private String presentKeywords;
    private String missingKeywords;
    private int keywordCoverage;
}
