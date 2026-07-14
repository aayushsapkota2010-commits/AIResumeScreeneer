package com.example.AIResumeScreeneer.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.JobRankingResponse;

@Service
public class JobRankingService {

    public List<JobRankingResponse> rankJobs(
            String resumeText,
            List<String> jobs) {

        List<JobRankingResponse> result =
                new ArrayList<>();

        String resume =
                resumeText.toLowerCase();

        int count = 1;

        for(String jd : jobs) {

            String lower =
                    jd.toLowerCase();

            int score = 0;

            if(lower.contains("java") &&
                    resume.contains("java"))
                score += 15;

            if(lower.contains("spring") &&
                    resume.contains("spring"))
                score += 15;

            if(lower.contains("mysql") &&
                    resume.contains("mysql"))
                score += 15;

            if(lower.contains("mongodb") &&
                    resume.contains("mongodb"))
                score += 15;

            if(lower.contains("docker") &&
                    resume.contains("docker"))
                score += 20;

            if(lower.contains("aws") &&
                    resume.contains("aws"))
                score += 20;

            result.add(
                    JobRankingResponse.builder()
                            .jobTitle("Job " + count)
                            .matchPercentage(score)
                            .build()
            );

            count++;
        }

        result.sort(
                Comparator.comparingInt(
                        JobRankingResponse::getMatchPercentage)
                        .reversed()
        );

        return result;
    }
}