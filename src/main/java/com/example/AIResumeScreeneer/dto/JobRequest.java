package com.example.AIResumeScreeneer.dto;

import lombok.Data;

@Data
public class JobRequest {

    private String title;

    private String company;

    private String location;

    private String employmentType;

    private String experience;

    private String salary;

    private String description;

    private String requiredSkills;
}