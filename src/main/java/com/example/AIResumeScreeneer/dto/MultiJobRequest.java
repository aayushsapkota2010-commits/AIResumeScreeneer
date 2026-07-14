package com.example.AIResumeScreeneer.dto;

import java.util.List;

import lombok.Data;

@Data
public class MultiJobRequest {

    private List<String> jobDescriptions;
}