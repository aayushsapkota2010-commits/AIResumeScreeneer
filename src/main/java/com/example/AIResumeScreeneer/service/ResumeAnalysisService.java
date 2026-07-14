package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.ResumeAnalysisResponse;

@Service
public class ResumeAnalysisService {

    public ResumeAnalysisResponse analyze(String text) {

        String lower = text.toLowerCase();

        int score = 0;

        StringBuilder strengths =
                new StringBuilder();

        StringBuilder weaknesses =
                new StringBuilder();

        StringBuilder recommendations =
                new StringBuilder();

        StringBuilder skills =
                new StringBuilder();

        if(lower.contains("java")) {
            score += 15;
            skills.append("Java, ");
        }

        if(lower.contains("spring")) {
            score += 20;
            skills.append("Spring Boot, ");
        }

        if(lower.contains("mysql")) {
            score += 10;
            skills.append("MySQL, ");
        }

        if(lower.contains("mongodb")) {
            score += 10;
            skills.append("MongoDB, ");
        }

        if(lower.contains("git")) {
            score += 10;
            skills.append("Git, ");
        }

        if(lower.contains("github")) {
            score += 10;
            skills.append("GitHub, ");
        }

        if(lower.contains("project")) {
            strengths.append(
                    "Has practical projects. ");
        }

        if(lower.contains("intern")) {
            strengths.append(
                    "Has internship experience. ");
        }

        if(!lower.contains("docker")) {

            weaknesses.append(
                    "Docker missing. ");

            recommendations.append(
                    "Learn Docker and containerization. ");
        }

        if(!lower.contains("aws")) {

            weaknesses.append(
                    "AWS missing. ");

            recommendations.append(
                    "Add AWS cloud projects. ");
        }

        if(!lower.contains("kubernetes")) {

            weaknesses.append(
                    "Kubernetes missing. ");

            recommendations.append(
                    "Learn Kubernetes basics. ");
        }

        return ResumeAnalysisResponse.builder()
                .atsScore(Math.min(score, 100))
                .skills(skills.toString())
                .strengths(strengths.toString())
                .weaknesses(weaknesses.toString())
                .recommendations(recommendations.toString())
                .build();
    }
}