package com.example.AIResumeScreeneer.service;

import java.util.*;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.JobMatchResponse;

@Service
public class JobMatchingService {

    public JobMatchResponse matchResume(
            String resumeText,
            String jobDescription) {

        List<String> skills = Arrays.asList(
                "java",
                "spring boot",
                "mysql",
                "mongodb",
                "docker",
                "aws",
                "microservices",
                "react",
                "git",
                "rest api"
        );

        String resume =
                resumeText.toLowerCase();

        String jd =
                jobDescription.toLowerCase();

        List<String> matched =
                new ArrayList<>();

        List<String> missing =
                new ArrayList<>();

        for(String skill : skills) {

            if(jd.contains(skill)) {

                if(resume.contains(skill)) {
                    matched.add(skill);
                }
                else {
                    missing.add(skill);
                }
            }
        }

        int total =
                matched.size() + missing.size();

        int percentage =
                total == 0 ? 0 :
                        (matched.size() * 100) / total;

        return JobMatchResponse.builder()
                .matchPercentage(percentage)
                .matchedSkills(String.join(", ", matched))
                .missingSkills(String.join(", ", missing))
                .recommendation(
                        missing.isEmpty()
                                ? "Excellent Match"
                                : "Learn: "
                                + String.join(", ", missing))
                .build();
    }
}