package com.example.AIResumeScreeneer.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PipelineResponse {

    private long applied;

    private long screening;

    private long shortlisted;

    private long interview;

    private long selected;

    private long rejected;
}