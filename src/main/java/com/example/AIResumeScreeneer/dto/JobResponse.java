package com.example.AIResumeScreeneer.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class JobResponse {

    private Long id;

    private String title;

    private String company;

    private String location;

    private String employmentType;

    private String experience;

    private String salary;

    private String description;

    private String requiredSkills;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}