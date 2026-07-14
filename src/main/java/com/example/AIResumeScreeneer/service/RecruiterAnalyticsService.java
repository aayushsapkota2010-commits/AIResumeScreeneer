package com.example.AIResumeScreeneer.service;

import java.util.*;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.RecruiterAnalyticsResponse;
import com.example.AIResumeScreeneer.entity.CandidateStatus;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecruiterAnalyticsService {

    private final ResumeRepository resumeRepository;

    public RecruiterAnalyticsResponse getAnalytics() {

        List<Resume> resumes =
                resumeRepository.findAll();

        long totalResumes =
                resumes.size();

        double avgAts =
                resumes.stream()
                        .filter(r -> r.getAtsScore() != null)
                        .mapToInt(Resume::getAtsScore)
                        .average()
                        .orElse(0);

        long shortlisted =
                resumes.stream()
                        .filter(r ->
                                r.getStatus() ==
                                        CandidateStatus.SHORTLISTED)
                        .count();

        long selected =
                resumes.stream()
                        .filter(r ->
                                r.getStatus() ==
                                        CandidateStatus.SELECTED)
                        .count();

        long rejected =
                resumes.stream()
                        .filter(r ->
                                r.getStatus() ==
                                        CandidateStatus.REJECTED)
                        .count();

        Map<String, Integer> skillCount =
                new HashMap<>();

        for (Resume resume : resumes) {

            if (resume.getSkills() == null)
                continue;

            String[] skills =
                    resume.getSkills().split(",");

            for (String skill : skills) {

                String s = skill.trim();

                skillCount.put(
                        s,
                        skillCount.getOrDefault(
                                s,
                                0) + 1);
            }
        }

        String topSkill =
                skillCount.entrySet()
                        .stream()
                        .max(Map.Entry.comparingByValue())
                        .map(Map.Entry::getKey)
                        .orElse("N/A");

        return RecruiterAnalyticsResponse
                .builder()
                .totalResumes(totalResumes)
                .averageAtsScore(avgAts)
                .shortlisted(shortlisted)
                .selected(selected)
                .rejected(rejected)
                .topSkill(topSkill)
                .build();
    }
}