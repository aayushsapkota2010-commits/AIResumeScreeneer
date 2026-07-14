package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.ResumeImprovementResponse;

@Service
public class ResumeImprovementService {

    public ResumeImprovementResponse generate(
            String resumeText,
            String jobDescription) {

        String lower =
                resumeText.toLowerCase();

        StringBuilder missing =
                new StringBuilder();

        if(!lower.contains("docker"))
            missing.append("Docker, ");

        if(!lower.contains("aws"))
            missing.append("AWS, ");

        if(!lower.contains("kubernetes"))
            missing.append("Kubernetes, ");

        if(!lower.contains("microservices"))
            missing.append("Microservices, ");

        return ResumeImprovementResponse.builder()

                .profileSummary(
                        "Java Backend Developer skilled in Spring Boot, MySQL, MongoDB and REST APIs.")

                .missingSkills(
                        missing.toString())

                .recommendedProjects(
                        "E-Commerce Backend, Banking API, URL Shortener, Job Portal")

                .certifications(
                        "AWS Cloud Practitioner, Docker Essentials, Kubernetes Fundamentals")

                .improvementPlan(
                        "Add cloud technologies, deployment experience, microservices projects and CI/CD pipelines")

                .build();
    }
}