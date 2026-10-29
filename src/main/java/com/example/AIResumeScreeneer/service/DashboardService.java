
package com.example.AIResumeScreeneer.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.DashboardResponse;
import com.example.AIResumeScreeneer.entity.CandidateStatus;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ResumeRepository resumeRepository;

    public DashboardResponse getDashboard() {

        // Only active resumes are used in dashboard calculations.
        List<Resume> resumes = resumeRepository.findByDeletedFalse();

        long totalResumes = resumes.size();

        double totalAtsScore = 0;
        int highestAtsScore = 0;
        int highestMatchScore = 0;

        long shortlisted = 0;
        long selected = 0;
        long rejected = 0;

        Map<String, Integer> skillCount = new HashMap<>();

        for (Resume resume : resumes) {

            int atsScore = resume.getAtsScore() != null
                    ? resume.getAtsScore()
                    : 0;

            int matchScore = resume.getMatchScore() != null
                    ? resume.getMatchScore()
                    : 0;

            totalAtsScore += atsScore;
            highestAtsScore = Math.max(highestAtsScore, atsScore);
            highestMatchScore = Math.max(highestMatchScore, matchScore);

            CandidateStatus status = resume.getStatus();

            if (status == CandidateStatus.SHORTLISTED) {
                shortlisted++;
            } else if (status == CandidateStatus.SELECTED) {
                selected++;
            } else if (status == CandidateStatus.REJECTED) {
                rejected++;
            }

            if (resume.getSkills() != null
                    && !resume.getSkills().isBlank()) {

                String[] skills = resume.getSkills().split(",");

                for (String skill : skills) {

                    String cleanedSkill = skill.trim();

                    if (!cleanedSkill.isEmpty()) {
                        skillCount.merge(cleanedSkill, 1, Integer::sum);
                    }
                }
            }
        }

        double averageAtsScore = totalResumes > 0
                ? totalAtsScore / totalResumes
                : 0.0;

        String topSkill = "N/A";
        int maxCount = 0;

        for (Map.Entry<String, Integer> entry : skillCount.entrySet()) {

            if (entry.getValue() > maxCount) {
                maxCount = entry.getValue();
                topSkill = entry.getKey();
            }
        }

        return DashboardResponse.builder()
                .totalResumes(totalResumes)
                .averageAtsScore(averageAtsScore)
                .highestAtsScore(highestAtsScore)
                .highestMatchScore(highestMatchScore)
                .shortlisted(shortlisted)
                .selected(selected)
                .rejected(rejected)
                .topSkill(topSkill)
                .build();
    }
}
